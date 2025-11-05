'use client'

import { Editor, useEditorState } from '@tiptap/react'
import { Select } from '@/components/atoms/form/select/Select'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import styles from './ListSelect.module.scss'

/**
 * **Dropdown selector** for list formatting in TipTap editor.
 *
 * Intelligent list type selector that allows users to toggle between bullet lists and ordered lists.
 * Features seamless integration with TipTap's list commands and supports clearing active lists.
 *
 * Example:
 * ```tsx
 * <ListSelect editor={editor} />
 * ```
 *
 * Notes:
 * - Icon-based dropdown with bullet list and numbered list options.
 * - Smart detection of currently active list type.
 * - Toggle functionality - selecting active list type clears the list.
 * - Seamless integration with TipTap editor commands.
 */

const listOptions = [
	{
		value: 'bulletList',
		label: <span className={styles.iconBulletList} />,
		searchText: 'Bullet list',
	},
	{
		value: 'orderedList',
		label: <span className={styles.iconOrderedList} />,
		searchText: 'Numbered list',
	},
]

function ListSelect({ editor }: { editor: Editor | null }) {
	const getActiveList = (editor: Editor | null): string | undefined => {
		if (!editor) return undefined
		if (editor.isActive('bulletList')) return 'bulletList'
		if (editor.isActive('orderedList')) return 'orderedList'
		return undefined
	}

	const currentList = useEditorState({
		editor,
		selector: ({ editor }) => getActiveList(editor),
	})

	if (!editor) return null

	const onChange = (val?: string) => {
		if (!val) {
			// Clear any active list
			editor.chain().focus().liftListItem('listItem').run()
		} else if (val === 'bulletList') {
			editor.chain().focus().toggleBulletList().run()
		} else if (val === 'orderedList') {
			editor.chain().focus().toggleOrderedList().run()
		}
	}

	return (
		<Tooltip>
			<Tooltip.Trigger>
				<Select
					value={currentList ?? undefined}
					options={listOptions}
					placeholder={<span className={styles.iconDefault} />}
					variant="icon"
					onChange={onChange}
					className={styles.listSelect}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content>List</Tooltip.Content>
		</Tooltip>
	)
}

export default ListSelect
