'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { Select } from '@/components/atoms/form/select/Select'
import { useEditor, EditorContent, Editor, JSONContent } from '@tiptap/react'
import { Placeholder } from '@tiptap/extensions'
import Avatar from '@/components/atoms/avatar/Avatar'
import GlobalDropzoneWrapper from '@/components/atoms/rich-text-editor/dropzone/GlobalDropzoneWrapper'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import HardBreak from '@tiptap/extension-hard-break'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import PostMenu from '@/components/atoms/rich-text-editor/post-editor/PostMenu'
import { toDoc } from '@/util/tiptapNormalize'

import style from './RichPostEditor.module.scss'

interface RichPostEditorProps {
	content?: string | JSONContent[] | { type: 'doc'; content?: JSONContent[] } | null | undefined
	onContentChange?: (content: { type: 'doc'; content?: JSONContent[] } | null) => void
	handleSendComment?: (doc?: { type: 'doc'; content?: JSONContent[] }) => void
}

function RichPostEditor({ content, onContentChange, handleSendComment }: RichPostEditorProps) {
	const [isReady, setIsReady] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [isEmpty, setIsEmpty] = useState(true)
	const componentRef = useRef<HTMLDivElement>(null)

	const extensions = useMemo(
		() => [
			StarterKit.configure({
				link: false,
				hardBreak: false,
			}),
			Placeholder.configure({
				placeholder: "Share what's new...",
			}),
			Link.configure({
				openOnClick: true,
			}),
			Image.configure({
				inline: true,
			}),
			YouTube.configure({
				inline: true,
			}),
			Emoji.configure({
				emojis: gitHubEmojis,
				enableEmoticons: true,
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
		(doc: { type: 'doc'; content?: JSONContent[] }, editorIsEmpty: boolean) => {
			setIsEmpty(editorIsEmpty)
			onContentChange?.(editorIsEmpty ? null : doc)
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
					return true
				}
				return false
			},
		},
		onCreate: () => {
			requestAnimationFrame(() => {
				setIsReady(true)
			})
		},
		onDestroy: () => setIsReady(false),
		onUpdate: ({ editor }: { editor: Editor }) => {
			const doc = editor?.getJSON()
			handleContentUpdate(doc ?? null, editor?.isEmpty ?? false)
		},
		onBlur: ({ editor }: { editor: Editor }) => {
			const doc = editor?.getJSON()
			handleContentUpdate(doc ?? null, editor?.isEmpty ?? false)
		},
	}) as Editor

	useEffect(() => {
		if (editor) {
			if (content === null) {
				editor.commands.clearContent()
				setIsEmpty(true)
			} else if (editor && content !== null) {
				const newContent = toDoc(content)
				editor.commands.setContent(newContent)
				setIsEmpty(editor.isEmpty)
			}
		}
	}, [editor, content])

	useEffect(() => {
		if (!isFocused) return

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement

			if (componentRef.current?.contains(target)) return

			if (target.closest('[data-floating-ui-portal]') || target.closest('[role="listbox"]')) return

			setIsFocused(false)
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isFocused])

	const handleSend = useCallback(() => {
		const doc = editor?.getJSON()
		onContentChange?.(doc)
		handleSendComment?.()
		setIsFocused(false)
	}, [editor, onContentChange, handleSendComment])

	const shouldShowToolbar = isFocused

	const privacyOptions = [
		{ label: 'Everyone', value: 'everyone' },
		{ label: 'Friends', value: 'friends' },
		{ label: 'Only Me', value: 'only_me' },
	]

	return (
		<>
			{!isReady ? (
				<Skeleton className={style.skeleton} />
			) : (
				<div ref={componentRef} className={style.postEditor} data-show={shouldShowToolbar}>
					<div className={style.header}>
						<div className={style.avatar} onClick={() => setIsFocused(true)}>
							<Avatar src="/images/avatar-placeholder.png" alt="Profile Picture" size={34} />
							{!shouldShowToolbar ? (
								<p className={style.placeholder}>Share what&apos;s new...</p>
							) : (
								<p className={style.name}>John Doe</p>
							)}
						</div>
						{shouldShowToolbar && (
							<GlobalDropzoneWrapper editor={editor} maxFiles={3} maxSizeMB={5}>
								<EditorContent editor={editor} />
							</GlobalDropzoneWrapper>
						)}
					</div>
					{shouldShowToolbar && (
						<>
							<Select
								leftIcon={<span className={style.iconGlobe} />}
								placeholder="Select privacy"
								defaultValue="everyone"
								options={privacyOptions}
								className={style.privacySelect}
							/>
							<div className={style.toolbar}>
								<PostMenu editor={editor} />

								<CustomButton
									radius="full"
									disabled={isEmpty}
									onClick={handleSend}
									aria-label="Post"
									className={style.postButton}
								>
									Post
								</CustomButton>
							</div>
						</>
					)}
				</div>
			)}
		</>
	)
}

export default RichPostEditor
