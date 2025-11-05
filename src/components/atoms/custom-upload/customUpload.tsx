import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './customUpload.module.scss'

interface CustomUploadProps {
	icon: string
	label: string
	span?: string
	row?: boolean
	column?: boolean
	onImageSelect?: (file: File) => void
	onImageRemove?: () => void
	acceptedTypes?: string[]
	maxSize?: number
	preview?: boolean
	disabled?: boolean
	className?: string
	height?: string | number
	width?: string | number
	uploadType?: 'image' | 'video' | 'both'
	styleType?: 'bordered' | 'solid'
}

const CustomUpload: React.FC<CustomUploadProps> = ({
	icon,
	label,
	span,
	row = false,
	column = false,
	onImageSelect,
	onImageRemove,
	acceptedTypes,
	maxSize = 25,
	preview = true,
	disabled = false,
	className = '',
	height = '300px',
	width = '100%',
	uploadType = 'image',
	styleType = 'solid',
}) => {
	// Set default accepted types based on upload type
	const defaultAcceptedTypes =
		uploadType === 'video'
			? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm']
			: uploadType === 'both'
				? [
						'image/jpeg',
						'image/jpg',
						'image/png',
						'image/gif',
						'image/webp',
						'video/mp4',
						'video/avi',
						'video/mov',
						'video/wmv',
						'video/flv',
						'video/webm',
					]
				: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

	const finalAcceptedTypes = acceptedTypes || defaultAcceptedTypes
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [isDragOver, setIsDragOver] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const validateFile = useCallback(
		(file: File): string | null => {
			if (!finalAcceptedTypes.includes(file.type)) {
				const fileType =
					uploadType === 'video' ? 'video' : uploadType === 'both' ? 'image or video' : 'image'
				return `Please select a valid ${fileType} file. Accepted types: ${finalAcceptedTypes.join(', ')}`
			}

			const fileSizeMB = file.size / (1024 * 1024)
			if (fileSizeMB > maxSize) {
				return `File size must be less than ${maxSize}MB`
			}

			return null
		},
		[finalAcceptedTypes, maxSize, uploadType]
	)

	const handleFileSelect = useCallback(
		(file: File) => {
			const validationError = validateFile(file)
			if (validationError) {
				setError(validationError)
				return
			}

			setError(null)

			if (preview) {
				const reader = new FileReader()
				reader.onload = e => {
					setSelectedImage(e.target?.result as string)
				}
				reader.readAsDataURL(file)
			}

			onImageSelect?.(file)
		},
		[validateFile, preview, onImageSelect]
	)

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			e.stopPropagation()
			if (!disabled) {
				setIsDragOver(true)
			}
		},
		[disabled]
	)

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragOver(false)

			if (disabled) return

			const files = Array.from(e.dataTransfer.files)
			if (files.length > 0) {
				handleFileSelect(files[0])
			}
		},
		[disabled, handleFileSelect]
	)

	const handleClick = useCallback(() => {
		if (!disabled) {
			fileInputRef.current?.click()
		}
	}, [disabled])

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files
			if (files && files.length > 0) {
				handleFileSelect(files[0])
			}
		},
		[handleFileSelect]
	)

	const handleRemoveImage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			setSelectedImage(null)
			setError(null)
			onImageRemove?.()
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		},
		[onImageRemove]
	)

	return (
		<div className={`${style.imageUpload} ${className} `} style={{ width, height }}>
			<div
				className={`${style.imageUploadContent} ${row ? style.row : ''} ${column ? style.column : ''} ${isDragOver ? style.dragOver : ''} ${disabled ? style.disabled : ''}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={handleClick}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept={finalAcceptedTypes.join(',')}
					onChange={handleFileInputChange}
					className={style.hiddenInput}
					disabled={disabled}
				/>

				{selectedImage && preview ? (
					<div className={style.imagePreview}>
						<Image
							src={selectedImage}
							alt="Preview"
							width={200}
							height={200}
							className={style.previewImage}
						/>
						<div
							className={style.removeButton}
							onClick={handleRemoveImage}
							aria-label="Remove image"
						>
							<ButtonIcon
								icon="/icons/x.svg"
								variant="secondary"
								styleType="icon"
								size={16}
								extraClass={style.removeButtonIcon}
							/>
						</div>
					</div>
				) : (
					<div className={style.uploadContent}>
						<ButtonIcon
							icon={icon}
							variant="secondary"
							styleType="icon"
							size={16}
							extraClass={`${style.imageUploadIcon} ${styleType === 'bordered' ? style.bordered : ''}`}
							tintColor="var(--jh-gray-02)"
						/>
						<div className={style.uploadContentText}>
							<label className={style.uploadLabel}>{label}</label>
							{span && <span className={style.uploadSpan}>{span}</span>}
						</div>
					</div>
				)}

				{error && <div className={style.errorMessage}>{error}</div>}
			</div>
		</div>
	)
}

export default CustomUpload
