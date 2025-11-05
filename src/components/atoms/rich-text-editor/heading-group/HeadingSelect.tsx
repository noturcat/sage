'use client'

import { Editor, useEditorState } from '@tiptap/react'
import { Select } from '@/components/atoms/form/select/Select'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import styles from './HeadingSelect.module.scss'

/**
 * **Dropdown selector** for heading levels in TipTap editor.
 *
 * Sophisticated heading level selector that enables users to apply heading styles (H1-H4) to text.
 * Features toggle functionality where selecting the current heading level converts text back to paragraph.
 *
 * Example:
 * ```tsx
 * <HeadingSelect editor={editor} />
 * ```
 *
 * Notes:
 * - Icon-based dropdown with heading levels H1 through H4.
 * - Smart detection of currently active heading level (0-6 support).
 * - Toggle functionality - selecting active heading converts to paragraph.
 * - Seamless integration with TipTap heading commands.
 */

const headingOptions = [
	{
		value: 'H1',
		label: <span className={styles.iconHeading1} />,
		searchText: 'Heading 1',
	},
	{
		value: 'H2',
		label: <span className={styles.iconHeading2} />,
		searchText: 'Heading 2',
	},
	{
		value: 'H3',
		label: <span className={styles.iconHeading3} />,
		searchText: 'Heading 3',
	},
	{
		value: 'H4',
		label: <span className={styles.iconHeading4} />,
		searchText: 'Heading 4',
	},
]

function HeadingSelect({ editor }: { editor: Editor | null }) {
	const getActiveHeadingLevel = (editor: Editor | null): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
		if (!editor) return 0
		for (let l = 1 as 1 | 2 | 3 | 4 | 5 | 6; l <= 6; l = (l + 1) as 1 | 2 | 3 | 4 | 5 | 6) {
			if (editor.isActive('heading', { level: l })) return l
		}
		return 0
	}

	const level = useEditorState({
		editor,
		selector: ({ editor }) => getActiveHeadingLevel(editor),
	})

	if (!editor) return null

	const value: string | undefined = level === 0 ? undefined : `H${level}`

	const onChange = (val?: string) => {
		if (!val || val === value) {
			editor.chain().focus().setParagraph().run()
		} else {
			editor
				.chain()
				.focus()
				.setHeading({ level: Number(val.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6 })
				.run()
		}
	}

	return (
		<Tooltip>
			<Tooltip.Trigger>
				<Select
					value={value}
					options={headingOptions}
					placeholder={<span className={styles.iconDefault} />}
					variant="icon"
					onChange={onChange}
					className={styles.headingSelect}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content>Heading</Tooltip.Content>
		</Tooltip>
	)
}

export default HeadingSelect
