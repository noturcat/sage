import Image from 'next/image'
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	arrow,
	useInteractions,
	useHover,
	useDismiss,
} from '@floating-ui/react'
import style from './FileCardInput.module.scss'
import CustomButton from '@/components/atoms/button/CustomButton'

interface FileCardInputProps {
	label: string
	title: string
	description: string
	required?: boolean
	extractedImages?: Array<{ src: string; alt?: string }>
	selectedImage?: File | null
	onImageSelect?: (file: File | null) => void
}

const templateImages = [
	'/images/jh-template-1.png',
	'/images/jh-template-2.png',
	'/images/jh-template-3.png',
]

function FileCardInput({
	label,
	title,
	description,
	required = false,
	extractedImages = [],
	selectedImage = null,
	onImageSelect,
}: FileCardInputProps) {
	const [file, setFile] = useState<File | null>(null)
	const [isHover, setIsHover] = useState(false)
	const fileIconRef = useRef<HTMLDivElement>(null)
	const arrowRef = useRef<HTMLDivElement>(null)

	const allImages = useMemo(
		() => [...extractedImages, ...templateImages.map(src => ({ src, alt: 'Template' }))],
		[extractedImages]
	)

	// Floating UI setup
	const { refs, floatingStyles, context } = useFloating({
		open: isHover,
		onOpenChange: setIsHover,
		placement: 'bottom',
		strategy: 'absolute',
		middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
		whileElementsMounted: autoUpdate,
	})

	const hover = useHover(context, {
		delay: { open: 100, close: 200 },
	})
	const dismiss = useDismiss(context)

	const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss])

	// Ensure smooth positioning without initial transition
	const stableFloatingStyles = React.useMemo(() => {
		if (!isHover) return { display: 'none' }

		return {
			...floatingStyles,
			// Ensure the element starts in the correct position
			transform: floatingStyles.transform || 'translate3d(0, 0, 0)',
		}
	}, [floatingStyles, isHover])

	// Get arrow positioning data from Floating UI
	const arrowData = React.useMemo(() => {
		const { x, y } = context.middlewareData.arrow || { x: 0, y: 0 }
		const placement = context.placement

		return {
			x: x || 0,
			y: y || 0,
			placement,
		}
	}, [context.middlewareData.arrow, context.placement])

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (file) {
				setFile(file)
				onImageSelect?.(file)
			}
		},
		[onImageSelect]
	)

	const handleFileClick = useCallback(() => {
		document.getElementById('file')?.click()
	}, [])

	// Update refs to use Floating UI refs
	useEffect(() => {
		if (refs.reference.current) {
			fileIconRef.current = refs.reference.current as HTMLDivElement
		}
	}, [refs.reference])

	const handleImageClick = useCallback(
		async (imageSrc: string, e: React.MouseEvent) => {
			e.stopPropagation()
			e.preventDefault()

			try {
				let file: File | null = null

				if (imageSrc.startsWith('data:')) {
					const [metadata, base64Data] = imageSrc.split(',')
					const mimeMatch = metadata.match(/:(.*?);/)
					const mimeType = mimeMatch?.[1] || 'image/jpeg'
					const byteString = atob(base64Data)
					const byteArray = new Uint8Array(byteString.length)

					for (let i = 0; i < byteString.length; i++) {
						byteArray[i] = byteString.charCodeAt(i)
					}

					const blob = new Blob([byteArray], { type: mimeType })
					file = new File([blob], 'image.jpg', { type: mimeType })
				} else {
					const response = await fetch(imageSrc)
					const blob = await response.blob()
					const filename = imageSrc.split('/').pop() || 'image.jpg'
					file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
				}

				if (file) {
					setFile(file)
					onImageSelect?.(file)
				}
			} catch (error) {
				console.error('Error loading image:', error)
			}

			setIsHover(false)
		},
		[onImageSelect]
	)

	const handleClearImage = useCallback(() => {
		setFile(null)
		onImageSelect?.(null)
	}, [onImageSelect])

	const displayImage = useMemo(() => {
		if (file instanceof File) return URL.createObjectURL(file)
		if (selectedImage instanceof File) return URL.createObjectURL(selectedImage)
		return null
	}, [file, selectedImage])

	useEffect(() => {
		if (file && displayImage) {
			return () => {
				URL.revokeObjectURL(displayImage)
			}
		}
	}, [file, displayImage])

	return (
		<main className={style.wrapper}>
			<span className={style.label}>
				{label} {required && <span className={style.required}>*</span>}
			</span>
			<article className={style.card}>
				<section className={style.content}>
					<p className={style.title}>{title}</p>
					<p className={style.description}>{description}</p>
				</section>
				<section className={style.file}>
					<input
						id="file"
						type="file"
						className={style.fileInput}
						onChange={handleFileChange}
						accept="image/*"
					/>
					{displayImage ? (
						<div className={style.imageContainer}>
							<Image
								src={displayImage}
								alt="Selected Image"
								width={72}
								height={72}
								className={style.image}
							/>
							<CustomButton
								size="icon"
								type="button"
								onClick={handleClearImage}
								aria-label="Clear selected image"
								className={style.clearImage}
							>
								<span className={style.iconClose} />
							</CustomButton>
						</div>
					) : (
						<div className={style.fileContainer}>
							<div
								ref={refs.setReference}
								className={style.fileIcon}
								onClick={handleFileClick}
								{...getReferenceProps()}
							>
								<Image
									src="/icons/tiptap-add-image.svg"
									alt="Add Image"
									width={18}
									height={18}
									unoptimized
								/>
							</div>
							{isHover && (
								<div
									ref={refs.setFloating}
									className={style.imageCard}
									style={stableFloatingStyles}
									{...getFloatingProps()}
								>
									<div className={style.tooltipIcons}>
										{allImages.map((image, index) => (
											<div
												className={style.tooltipIcon}
												key={index}
												onClick={e => handleImageClick(image.src, e)}
											>
												<Image
													src={image.src}
													alt={image.alt || `Image ${index + 1}`}
													width={72}
													height={72}
													className={style.tooltipImage}
												/>
											</div>
										))}
									</div>
									<p className={style.tooltipText}>
										Choose an Image from your post larger than 420x300 pixels or upload a new one
									</p>
									{/* Arrow pointing to trigger */}
									<div
										ref={arrowRef}
										className={style.arrow}
										style={
											{
												'--arrow-x': arrowData.x,
												'--arrow-y': arrowData.y,
											} as React.CSSProperties
										}
										data-placement={arrowData.placement}
										data-slot="tooltip-arrow"
									/>
								</div>
							)}
						</div>
					)}
					<label htmlFor="file" className={style.fileLabel}>
						Upload File
					</label>
				</section>
			</article>
		</main>
	)
}

export default FileCardInput
