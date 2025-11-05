import { useCallback, useState } from 'react'
import { Editor } from '@tiptap/react'

interface UseLinkPopoverProps {
	editor: Editor | null
}

export function useLinkPopover({ editor }: UseLinkPopoverProps) {
	const [isOpen, setIsOpen] = useState(false)

	const openLinkPopover = useCallback(() => {
		if (!editor) return

		// If text is selected, open the popover
		if (!editor.state.selection.empty) {
			setIsOpen(true)
		} else {
			// If no text is selected, insert a link placeholder
			editor.chain().focus().insertContent('<a href="">Link</a>').run()
			setIsOpen(true)
		}
	}, [editor])

	const closeLinkPopover = useCallback(() => {
		setIsOpen(false)
	}, [])

	const toggleLink = useCallback(() => {
		if (!editor) return

		if (editor.isActive('link')) {
			editor.chain().focus().unsetLink().run()
		} else {
			openLinkPopover()
		}
	}, [editor, openLinkPopover])

	const isLinkActive = editor?.isActive('link') ?? false

	return {
		isOpen,
		openLinkPopover,
		closeLinkPopover,
		toggleLink,
		isLinkActive,
	}
}
