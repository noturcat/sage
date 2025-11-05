'use client'

import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { useEditor, EditorContent, Editor, JSONContent } from '@tiptap/react'
import { Placeholder } from '@tiptap/extensions'
import GlobalDropzoneWrapper from '@/components/atoms/rich-text-editor/dropzone/GlobalDropzoneWrapper'
import { TableKit } from '@tiptap/extension-table'
import HardBreak from '@tiptap/extension-hard-break'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import MenuBar, { ToolbarConfig } from '@/components/atoms/rich-text-editor/menu-bar/MenuBar'
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from '@/components/atoms/form/Form'

import styles from './RichTextEditor.module.scss'

/**
 * **Comprehensive rich text editor** for TipTap rich text editor.
 *
 * Feature-rich rich text editor that provides access to all text formatting and content insertion tools
 * for the TipTap editor. Organized into logical groups with visual separators for improved usability.
 * **Comprehensive rich text editor** for TipTap rich text editor.
 *
 * Feature-rich rich text editor that provides access to all text formatting and content insertion tools
 * for the TipTap editor. Organized into logical groups with visual separators for improved usability.
 *
 * Example:
 * ```tsx
 * <RichTextEditor editor={editor} />
 * ```
 *
 * Notes:
 * - Grouped layout with visual separators for better UX.
 * - Smart undo/redo buttons that enable/disable based on editor history.
 * - Text formatting tools (bold, italic, underline, strike, code, highlight).
 * - Block-level elements (headings, lists, blockquotes, code blocks).
 * - Content insertion (images, videos, tables, horizontal rules).
 * Example:
 * ```tsx
 * <RichTextEditor editor={editor} />
 * ```
 *
 * Notes:
 * - Grouped layout with visual separators for better UX.
 * - Smart undo/redo buttons that enable/disable based on editor history.
 * - Text formatting tools (bold, italic, underline, strike, code, highlight).
 * - Block-level elements (headings, lists, blockquotes, code blocks).
 * - Content insertion (images, videos, tables, horizontal rules).
 * - Performance optimized with minimal re-renders
 * - SSR-safe with `immediatelyRender: false`
 * - Accessibility features with proper ARIA attributes
 * - CSS Modules styling for component isolation
 * - Empty state detection and validation
 */

const EDITOR_CONFIG = {
	placeholder: {
		includeChildren: false,
		emptyEditorClass: 'is-editor-empty',
	},
	link: {
		autolink: true,
		linkOnPaste: true,
		openOnClick: true,
		protocols: ['http', 'https', 'mailto', 'tel'],
		HTMLAttributes: {
			target: '_blank',
			rel: 'noopener noreferrer',
		},
	},
	table: {
		resizable: true,
	},
	youtube: {
		controls: false,
		nocookie: true,
	},
	image: {
		allowBase64: true,
	},
	textAlign: {
		types: ['heading', 'paragraph'],
	},
}
interface RichTextEditorProps {
	initialContent: string | JSONContent[] // Fix type
	placeholder?: string
	onContentChange?: (content: JSONContent[]) => void
	withBorder?: boolean
	toolbarConfig?: ToolbarConfig
	minHeight?: string
	showToolbar?: boolean | 'auto'
}

function RichTextEditor({
	initialContent,
	placeholder = 'Start typing…',
	onContentChange,
	withBorder = true,
	toolbarConfig,
	minHeight = '6.5rem',
	showToolbar = true,
}: RichTextEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const isCalculatingRef = useRef(false)
	const [isReady, setIsReady] = useState(false)
	const [isFocused, setIsFocused] = useState(false)

	const extensions = useMemo(
		() => [
			StarterKit.configure({
				link: false,
				hardBreak: false,
			}),
			TableKit.configure({ table: EDITOR_CONFIG.table }),
			Youtube.configure(EDITOR_CONFIG.youtube),
			Superscript,
			Subscript,
			TextAlign.configure(EDITOR_CONFIG.textAlign),
			Highlight,
			Image.configure(EDITOR_CONFIG.image),
			Link.configure(EDITOR_CONFIG.link),
			Placeholder.configure({
				...EDITOR_CONFIG.placeholder,
				placeholder: '',
			}),
			HardBreak.configure({ keepMarks: true }).extend({
				addKeyboardShortcuts() {
					return {
						'Shift-Enter': () => this.editor.commands.setHardBreak(),
						'Mod-Enter': () => this.editor.commands.setHardBreak(),
					}
				},
			}),
		],
		[]
	)

	const handleContentUpdate = useCallback(
		(content: JSONContent[], isEmpty: boolean) => {
			onContentChange?.(isEmpty ? [] : content)
		},
		[onContentChange]
	)

	const setPlaceholderMinHeight = useCallback((el: HTMLElement, text: string) => {
		if (isCalculatingRef.current) return
		if (isCalculatingRef.current) return
		isCalculatingRef.current = true

		requestAnimationFrame(() => {
			const sizer = document.createElement('div')
			sizer.style.cssText = `
        position:absolute; visibility:hidden; pointer-events:none; white-space:pre-wrap;
        inset:0 auto auto 0; font:inherit; max-width:100%;
      `
			sizer.textContent = text
			el.appendChild(sizer)

			const h = sizer.getBoundingClientRect().height
			// Use the custom minHeight prop instead of hardcoded value
			el.style.setProperty('--editor-min-h', `${Math.ceil(h + 12)}px`)
			el.removeChild(sizer)

			isCalculatingRef.current = false
		})
	}, [])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		setPlaceholderMinHeight(el, placeholder)

		let timeoutId: NodeJS.Timeout
		const debouncedResize = () => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => setPlaceholderMinHeight(el, placeholder), 150)
		}

		const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(debouncedResize) : null
		ro?.observe(el)

		return () => {
			ro?.disconnect()
			clearTimeout(timeoutId)
		}
	}, [placeholder, setPlaceholderMinHeight])

	const editorConfig = useMemo(
		() => ({
			extensions,
			content: '',
			immediatelyRender: false,
			shouldRerenderOnTransaction: false,
			editorProps: {
				attributes: {
					class: styles.editor,
					'data-placeholder': placeholder,
				},
			},
			onCreate: () => setIsReady(true),
			onDestroy: () => setIsReady(false),
			onUpdate: ({ editor }: { editor: Editor }) => {
				const json = editor.getJSON()
				const isEmpty = editor.isEmpty
				handleContentUpdate(json.content, isEmpty)
			},
			onBlur: ({ editor }: { editor: Editor }) => {
				const json = editor.getJSON()
				const isEmpty = editor.isEmpty
				handleContentUpdate(json.content, isEmpty)
			},
			onFocus: () => {
				setIsFocused(true)
			},
		}),
		[extensions, placeholder, handleContentUpdate] // Stable dependencies only
	)

	const editor = useEditor(editorConfig)

	// Optimized content setting - only when needed
	useEffect(() => {
		if (
			editor &&
			isReady &&
			initialContent &&
			Array.isArray(initialContent) &&
			initialContent.length > 0
		) {
			// Only set content if it's different from current content
			const currentContent = editor.getJSON().content
			if (JSON.stringify(currentContent) !== JSON.stringify(initialContent)) {
				editor.commands.setContent(initialContent)
			}
		}
	}, [editor, isReady, initialContent])

	// useEffect(() => {
	// 	if (showToolbar !== 'auto') return

	// 	const onPointerDown = (event: PointerEvent) => {
	// 		const wrapper = containerRef.current
	// 		if (!wrapper) return
	// 		const target = event.target as Node

	// 		if (!wrapper.contains(target)) {
	// 			setIsFocused(false)
	// 		} else {
	// 			setIsFocused(true)
	// 		}
	// 	}

	// 	document.addEventListener('pointerdown', onPointerDown, true)
	// 	return () => document.removeEventListener('pointerdown', onPointerDown, true)
	// }, [showToolbar])

	const shouldShowToolbar = useMemo(() => {
		if (showToolbar === false) return false
		if (showToolbar === 'auto') return isFocused
		return true
	}, [showToolbar, isFocused])

	return (
		<>
			{!isReady && (
				<Skeleton
					className={styles.skeleton}
					style={{ '--custom-min-height': minHeight } as React.CSSProperties}
				/>
			)}
			<div
				ref={containerRef}
				className={styles.wrapper}
				data-with-border={withBorder}
				data-visibility={isReady ? 'visible' : 'hidden'}
				data-toolbar-mode={showToolbar}
				onMouseDown={e => {
					if (editor && e.target === e.currentTarget) {
						editor.commands.focus('end')
					}
				}}
				style={{ '--custom-min-height': minHeight } as React.CSSProperties}
			>
				{shouldShowToolbar && (
					<div className={styles.toolbarContainer}>
						<MenuBar editor={editor} config={toolbarConfig} />
					</div>
				)}
				<GlobalDropzoneWrapper editor={editor} maxFiles={3} maxSizeMB={5}>
					<EditorContent editor={editor} />
				</GlobalDropzoneWrapper>
			</div>
		</>
	)
}

/**
 * **Comprehensive rich text editor input** for TipTap rich text editor.
 *
 * Feature-rich rich text editor that provides access to all text formatting and content insertion tools
 * for the TipTap editor. Organized into logical groups with visual separators for improved usability.
 *
 * Example:
 * ```tsx
 * <RichTextEditorInput name="content" form={form} />
 * ```
 *
 * Notes:
 * Feature-rich rich text editor that provides access to all text formatting and content insertion tools
 * for the TipTap editor. Organized into logical groups with visual separators for improved usability.
 *
 * Example:
 * ```tsx
 * <RichTextEditorInput name="content" form={form} />
 * ```
 *
 * Notes:
 * - Full React Hook Form integration with automatic field registration
 * - Type-safe form field paths with TypeScript generics
 * - Automatic error message display with FormMessage component
 * - Optional form label and description support with semantic HTML structure
 * - Zod validation compatible (no inline validation rules)
 * - Accessibility features with proper form field association
 * - Performance optimized with minimal re-renders
 * - Optional toolbar configuration
 * - Optional min height and toolbar visibility configuration
 * - Optional toolbar configuration
 * - Optional min height and toolbar visibility configuration
 */

function RichTextEditorInput<T extends FieldValues>({
	name,
	label,
	form,
	placeholder = 'Start typing…',
	description,
	withBorder = true,
	toolbarConfig,
	minHeight,
	showToolbar,
}: {
	name: Path<T>
	label?: string
	form: UseFormReturn<T>
	placeholder?: string
	description?: string
	withBorder?: boolean
	toolbarConfig?: ToolbarConfig
	minHeight?: string
	showToolbar?: boolean | 'auto'
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<RichTextEditor
							initialContent={field.value || ''}
							placeholder={placeholder}
							onContentChange={field.onChange} // Clear naming
							withBorder={withBorder}
							toolbarConfig={toolbarConfig}
							minHeight={minHeight}
							showToolbar={showToolbar}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { RichTextEditor, RichTextEditorInput }
