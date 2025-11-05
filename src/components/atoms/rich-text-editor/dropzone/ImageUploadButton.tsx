'use client'

import { useRef } from 'react'
import { Editor } from '@tiptap/react'
import CustomButton from '@/components/atoms/button/CustomButton'

/**
 * **Direct image upload button** for TipTap editor.
 *
 * Seamless image upload component that directly opens the file dialog when clicked,
 * eliminating the need for a dropzone interface. Provides immediate file selection
 * and automatic image insertion into the editor.
 *
 * Example:
 * ```tsx
 * <ImageUploadButton
 *   editor={editor}
 *   maxFiles={3}
 *   maxSizeMB={5}
 *   className="upload-button"
 * />
 * ```
 *
 * Notes:
 * - Direct file dialog opening on click
 * - Automatic file validation and size limits
 * - Image-to-data-URL conversion for immediate preview
 * - Seamless integration with TipTap editor
 */

interface ImageUploadButtonProps {
	editor: Editor
	maxFiles?: number
	maxSizeMB?: number
	className?: string
	children?: React.ReactNode
}

function ImageUploadButton({
	editor,
	maxFiles = 3,
	maxSizeMB = 5,
	className = '',
	children = 'Upload Image',
}: ImageUploadButtonProps) {
	const inputRef = useRef<HTMLInputElement>(null)

	const fileToDataUrl = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const r = new FileReader()
			r.onload = () => resolve(String(r.result))
			r.onerror = reject
			r.readAsDataURL(file)
		})

	async function insertImages(files: File[]) {
		if (!editor) return

		// File validation
		const accepted = files
			.slice(0, maxFiles)
			.filter(f => f.type.startsWith('image/') && f.size <= maxSizeMB * 1024 * 1024)

		// Convert to data URLs and insert
		const images = await Promise.all(
			accepted.map(async f => ({
				type: 'image',
				attrs: { src: await fileToDataUrl(f), alt: f.name },
			}))
		)

		// Insert images at current cursor position
		editor.chain().focus().insertContent(images).run()
	}

	const handleClick = () => {
		inputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? [])
		if (files.length > 0) {
			insertImages(files)
		}
		// Reset input value to allow selecting the same file again
		e.currentTarget.value = ''
	}

	return (
		<>
			<CustomButton
				variant="text"
				type="button"
				size="icon"
				className={className}
				onClick={handleClick}
			>
				{children}
			</CustomButton>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
		</>
	)
}

export default ImageUploadButton
