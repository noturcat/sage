'use client'

import { useRef, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import styles from './GlobalDropzoneWrapper.module.scss'

/**
 * **Global dropzone wrapper** for TipTap editor.
 *
 * Wraps the entire rich text editor with drag-and-drop functionality,
 * allowing users to drop images anywhere within the editor area.
 * Provides visual feedback during drag operations.
 *
 * Example:
 * ```tsx
 * <GlobalDropzoneWrapper editor={editor} maxFiles={3} maxSizeMB={5}>
 *   <EditorContent editor={editor} />
 * </GlobalDropzoneWrapper>
 * ```
 *
 * Notes:
 * - Global drag-and-drop support for the entire editor
 * - Visual feedback during drag operations
 * - Automatic file validation and size limits
 * - Seamless image insertion at cursor position
 */

interface GlobalDropzoneWrapperProps {
	editor: Editor
	maxFiles?: number
	maxSizeMB?: number
	children: React.ReactNode
	className?: string
}

function GlobalDropzoneWrapper({
	editor,
	maxFiles = 3,
	maxSizeMB = 5,
	children,
	className = '',
}: GlobalDropzoneWrapperProps) {
	const [isDragOver, setIsDragOver] = useState(false)
	const dragCounterRef = useRef(0)

	const fileToDataUrl = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const r = new FileReader()
			r.onload = () => resolve(String(r.result))
			r.onerror = reject
			r.readAsDataURL(file)
		})

	const insertImages = useCallback(
		async (files: File[]) => {
			if (!editor) return

			// File validation
			const accepted = files
				.slice(0, maxFiles)
				.filter(f => f.type.startsWith('image/') && f.size <= maxSizeMB * 1024 * 1024)

			if (accepted.length === 0) return

			// Convert to data URLs and insert
			const images = await Promise.all(
				accepted.map(async f => ({
					type: 'image',
					attrs: { src: await fileToDataUrl(f), alt: f.name },
				}))
			)

			// Insert images at current cursor position
			editor.chain().focus().insertContent(images).run()
		},
		[editor, maxFiles, maxSizeMB]
	)

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounterRef.current++
		if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
			setIsDragOver(true)
		}
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounterRef.current--
		if (dragCounterRef.current === 0) {
			setIsDragOver(false)
		}
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragOver(false)
			dragCounterRef.current = 0

			const files = Array.from(e.dataTransfer?.files ?? [])
			if (files.length > 0) {
				insertImages(files)
			}
		},
		[insertImages]
	)

	return (
		<div
			className={`${styles.globalDropzone} ${isDragOver ? styles.isDragOver : ''} ${className}`}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{children}
			{isDragOver && (
				<div className={styles.dropOverlay}>
					<div className={styles.dropMessage}>Drop images here to upload</div>
				</div>
			)}
		</div>
	)
}
export default GlobalDropzoneWrapper
