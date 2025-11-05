'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useEditor, EditorContent, Editor, JSONContent } from '@tiptap/react'
import { Placeholder } from '@tiptap/extensions'
import GlobalDropzoneWrapper from '@/components/atoms/rich-text-editor/dropzone/GlobalDropzoneWrapper'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import HardBreak from '@tiptap/extension-hard-break'
import CommentMenu from '@/components/atoms/rich-text-editor/comment-editor/CommentMenu'
import { toDoc } from '@/util/tiptapNormalize'

import style from './RichCommentEditor.module.scss'

interface RichCommentEditorProps {
	content?: string | JSONContent[] | { type: 'doc'; content?: JSONContent[] } | null | undefined
	onContentChange?: (content: { type: 'doc'; content?: JSONContent[] } | null) => void
	handleSendComment?: (doc?: { type: 'doc'; content?: JSONContent[] }) => void
}

function RichCommentEditor({
	content,
	onContentChange,
	handleSendComment,
}: RichCommentEditorProps) {
	const [isReady, setIsReady] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const componentRef = useRef<HTMLDivElement>(null)

	const extensions = useMemo(
		() => [
			StarterKit.configure({
				link: false,
				hardBreak: false,
			}),
			Placeholder.configure({
				placeholder: 'What are your thoughts?',
			}),
			Link.configure({
				autolink: true,
				linkOnPaste: true,
				openOnClick: true,
				protocols: ['http', 'https', 'mailto', 'tel'],
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer',
				},
			}),
			Image.configure({
				inline: true,
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
		(doc: { type: 'doc'; content?: JSONContent[] }, isEmpty: boolean) => {
			onContentChange?.(isEmpty ? null : doc)
		},
		[onContentChange]
	)

	const editor = useEditor({
		extensions,
		content: content === null ? null : toDoc(content),
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		parseOptions: {
			preserveWhitespace: 'full',
		},
		editorProps: {
			attributes: {
				class: style.editor,
				'aria-label': 'Comment editor',
				role: 'textbox',
			},
			handleKeyDown(_, event: KeyboardEvent) {
				if (event.key === 'Enter' && !event.shiftKey) {
					event.preventDefault()
					const doc = editor?.getJSON()
					onContentChange?.(doc ?? null)
					handleSendComment?.(doc ?? undefined)
					setIsFocused(false)
					return true
				}
				return false
			},
		},
		onCreate: () => setIsReady(true),
		onDestroy: () => setIsReady(false),
		onUpdate: ({ editor }: { editor: Editor }) => {
			const doc = editor?.getJSON()
			handleContentUpdate(doc ?? null, editor?.isEmpty ?? false)
		},
		onBlur: ({ editor }: { editor: Editor }) => {
			const doc = editor?.getJSON()
			handleContentUpdate(doc ?? null, editor?.isEmpty ?? false)
		},
		onFocus: () => {
			setIsFocused(true)
		},
	}) as Editor

	useEffect(() => {
		if (editor) {
			if (content === null) {
				editor.commands.clearContent()
			} else if (editor && content !== null) {
				const newContent = toDoc(content)
				editor.commands.setContent(newContent)
			}
		}
	}, [editor, content])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
				setIsFocused(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSend = useCallback(() => {
		const doc = editor?.getJSON()
		onContentChange?.(doc)
		handleSendComment?.()
		setIsFocused(false)
	}, [editor, onContentChange, handleSendComment])

	const shouldShowToolbar = isFocused

	return (
		<>
			{!isReady ? (
				<Skeleton className={style.skeleton} />
			) : (
				<div ref={componentRef} className={style.commentEditor}>
					<GlobalDropzoneWrapper editor={editor} maxFiles={3} maxSizeMB={5}>
						<EditorContent editor={editor} />
					</GlobalDropzoneWrapper>
					{shouldShowToolbar && (
						<div className={style.toolbar}>
							<CommentMenu editor={editor} />
							<CustomButton
								variant="text"
								size="icon"
								radius="full"
								disabled={editor?.isEmpty}
								onClick={handleSend}
								aria-label="Send comment"
							>
								<span className={style.sendIcon} />
							</CustomButton>
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default RichCommentEditor
