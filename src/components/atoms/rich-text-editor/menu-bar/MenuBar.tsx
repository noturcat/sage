import { Editor, useEditorState } from '@tiptap/react'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import HeadingSelect from '@/components/atoms/rich-text-editor/heading-group/HeadingSelect'
import ListSelect from '@/components/atoms/rich-text-editor/list-group/ListSelect'
import CustomButton from '@/components/atoms/button/CustomButton'
import ImageUploadButton from '@/components/atoms/rich-text-editor/dropzone/ImageUploadButton'
import LinkPopover from '@/components/atoms/rich-text-editor/link/LinkPopover'
import YouTubePopover from '@/components/atoms/rich-text-editor/youtube/YouTubePopover'
import styles from './MenuBar.module.scss'

/**
 * **Comprehensive toolbar** for TipTap rich text editor.
 *
 * Feature-rich toolbar that provides access to all text formatting and content insertion tools
 * for the TipTap editor. Organized into logical groups with visual separators for improved usability.
 *
 * Example:
 * ```tsx
 * <MenuBar editor={editor} />
 * <MenuBar editor={editor} config={BASIC_TOOLBAR} />
 * ```
 *
 * Notes:
 * - Grouped button layout with visual separators for better UX.
 * - Smart undo/redo buttons that enable/disable based on editor history.
 * - Text formatting tools (bold, italic, underline, strike, code, highlight).
 * - Block-level elements (headings, lists, blockquotes, code blocks).
 * - Content insertion (images, videos, tables, horizontal rules).
 * - Configurable toolbar with predefined presets
 */

// Toolbar configuration type
export type ToolbarConfig = {
	history?: boolean
	structure?: {
		headings?: boolean
		lists?: boolean
		blockquote?: boolean
		codeBlock?: boolean
	}
	textFormatting?: {
		bold?: boolean
		italic?: boolean
		underline?: boolean
		strike?: boolean
		code?: boolean
		highlight?: boolean
		link?: boolean
	}
	textModifiers?: {
		subscript?: boolean
		superscript?: boolean
	}
	textAlignment?: {
		left?: boolean
		center?: boolean
		right?: boolean
		justify?: boolean
	}
	contentInsertion?: {
		horizontalRule?: boolean
		table?: boolean
		youtube?: boolean
		image?: boolean
	}
}

export const MINIMAL_TOOLBAR: ToolbarConfig = {
	textFormatting: {
		bold: true,
		italic: true,
		underline: true,
	},
}

export const BASIC_TOOLBAR: ToolbarConfig = {
	history: true,
	structure: {
		headings: true,
		lists: true,
	},
	textFormatting: {
		bold: true,
		italic: true,
		underline: true,
		strike: true,
		link: true,
	},
	textAlignment: {
		left: true,
		center: true,
		right: true,
	},
}

export const COMMENT_TOOLBAR: ToolbarConfig = {
	textFormatting: {
		bold: true,
		italic: true,
		underline: true,
		code: true,
		link: true,
	},
	contentInsertion: {
		image: true,
	},
}

export const BLOG_TOOLBAR: ToolbarConfig = {
	history: true,
	structure: {
		headings: true,
		lists: true,
		blockquote: true,
	},
	textFormatting: {
		bold: true,
		italic: true,
		underline: true,
		strike: true,
		highlight: true,
		link: true,
	},
	textAlignment: {
		left: true,
		center: true,
		right: true,
	},
	contentInsertion: {
		horizontalRule: true,
		image: true,
	},
}

export const FULL_TOOLBAR: ToolbarConfig = {
	history: true,
	structure: {
		headings: true,
		lists: true,
		blockquote: true,
		codeBlock: true,
	},
	textFormatting: {
		bold: true,
		italic: true,
		underline: true,
		strike: true,
		code: true,
		highlight: true,
		link: true,
	},
	textModifiers: {
		subscript: true,
		superscript: true,
	},
	textAlignment: {
		left: true,
		center: true,
		right: true,
		justify: true,
	},
	contentInsertion: {
		horizontalRule: true,
		table: true,
		youtube: true,
		image: true,
	},
}

interface MenuBarProps {
	editor: Editor | null
	config?: ToolbarConfig
}

function MenuBar({ editor, config = FULL_TOOLBAR }: MenuBarProps) {
	const active = useEditorState({
		editor,
		selector: ({ editor }) => ({
			undo: editor?.can().undo() ?? false,
			redo: editor?.can().redo() ?? false,
			blockquote: editor?.isActive('blockquote') ?? false,
			codeBlock: editor?.isActive('codeBlock') ?? false,
			bold: editor?.isActive('bold') ?? false,
			italic: editor?.isActive('italic') ?? false,
			strike: editor?.isActive('strike') ?? false,
			code: editor?.isActive('code') ?? false,
			underline: editor?.isActive('underline') ?? false,
			highlight: editor?.isActive('highlight') ?? false,
			link: editor?.isActive('link') ?? false,
			superscript: editor?.isActive('superscript') ?? false,
			subscript: editor?.isActive('subscript') ?? false,
			left: editor?.isActive({ textAlign: 'left' }) ?? false,
			center: editor?.isActive({ textAlign: 'center' }) ?? false,
			right: editor?.isActive({ textAlign: 'right' }) ?? false,
			justify: editor?.isActive({ textAlign: 'justify' }) ?? false,
			horizontalRule: editor?.isActive('horizontalRule') ?? false,
			table: editor?.isActive('table') ?? false,
			youtube: editor?.isActive('youtube') ?? false,
			image: editor?.isActive('image') ?? false,
		}),
	})

	if (!editor) return null

	const buttonGroups = [
		...(config.history
			? [
					[
						{
							icon: <span className={styles.iconUndo} />,
							disabled: !active?.undo,
							name: 'Undo',
							onClick: () => editor.commands.undo(),
							isHistoryButton: true,
						},
						{
							icon: <span className={styles.iconRedo} />,
							disabled: !active?.redo,
							name: 'Redo',
							onClick: () => editor.commands.redo(),
							isHistoryButton: true,
						},
					],
				]
			: []),

		...(config.structure
			? [
					[
						...(config.structure.headings
							? [{ custom: <HeadingSelect editor={editor} key="heading-select" /> }]
							: []),
						...(config.structure.lists
							? [{ custom: <ListSelect editor={editor} key="list-select" /> }]
							: []),
						...(config.structure.blockquote
							? [
									{
										icon: <span className={styles.iconBlockquote} />,
										name: 'Blockquote',
										pressed: active?.blockquote,
										onClick: () => editor.chain().focus().toggleBlockquote().run(),
									},
								]
							: []),
						...(config.structure.codeBlock
							? [
									{
										icon: <span className={styles.iconCodeBlock} />,
										name: 'Code Block',
										pressed: active?.codeBlock,
										onClick: () => editor.chain().focus().toggleCodeBlock().run(),
									},
								]
							: []),
					].filter(Boolean),
				]
			: []),

		...(config.textFormatting
			? [
					[
						...(config.textFormatting.bold
							? [
									{
										icon: <span className={styles.iconBold} />,
										name: 'Bold',
										pressed: active?.bold,
										onClick: () => editor.chain().focus().toggleBold().run(),
									},
								]
							: []),
						...(config.textFormatting.italic
							? [
									{
										icon: <span className={styles.iconItalic} />,
										name: 'Italic',
										pressed: active?.italic,
										onClick: () => editor.chain().focus().toggleItalic().run(),
									},
								]
							: []),
						...(config.textFormatting.underline
							? [
									{
										icon: <span className={styles.iconUnderline} />,
										name: 'Underline',
										pressed: active?.underline,
										onClick: () => editor.chain().focus().toggleUnderline().run(),
									},
								]
							: []),
						...(config.textFormatting.strike
							? [
									{
										icon: <span className={styles.iconStrike} />,
										name: 'Strike',
										pressed: active?.strike,
										onClick: () => editor.chain().focus().toggleStrike().run(),
									},
								]
							: []),
						...(config.textFormatting.code
							? [
									{
										icon: <span className={styles.iconCode} />,
										name: 'Code',
										pressed: active?.code,
										onClick: () => editor.chain().focus().toggleCode().run(),
									},
								]
							: []),
						...(config.textFormatting.highlight
							? [
									{
										icon: <span className={styles.iconHighlight} />,
										name: 'Highlight',
										pressed: active?.highlight,
										onClick: () => editor.chain().focus().toggleHighlight().run(),
									},
								]
							: []),
						...(config.textFormatting.link
							? [
									{
										custom: editor ? <LinkPopover key="link-popover" editor={editor} /> : null,
									},
								]
							: []),
					].filter(Boolean),
				]
			: []),

		...(config.textModifiers
			? [
					[
						...(config.textModifiers.subscript
							? [
									{
										icon: <span className={styles.iconSubscript} />,
										name: 'Subscript',
										pressed: active?.subscript,
										onClick: () => editor.chain().focus().toggleSubscript().run(),
									},
								]
							: []),
						...(config.textModifiers.superscript
							? [
									{
										icon: <span className={styles.iconSuperscript} />,
										name: 'Superscript',
										pressed: active?.superscript,
										onClick: () => editor.chain().focus().toggleSuperscript().run(),
									},
								]
							: []),
					].filter(Boolean),
				]
			: []),

		...(config.textAlignment
			? [
					[
						...(config.textAlignment.left
							? [
									{
										icon: <span className={styles.iconLeft} />,
										name: 'Left',
										pressed: active?.left,
										onClick: () => editor.chain().focus().setTextAlign('left').run(),
									},
								]
							: []),
						...(config.textAlignment.center
							? [
									{
										icon: <span className={styles.iconCenter} />,
										name: 'Center',
										pressed: active?.center,
										onClick: () => editor.chain().focus().setTextAlign('center').run(),
									},
								]
							: []),
						...(config.textAlignment.right
							? [
									{
										icon: <span className={styles.iconRight} />,
										name: 'Right',
										pressed: active?.right,
										onClick: () => editor.chain().focus().setTextAlign('right').run(),
									},
								]
							: []),
						...(config.textAlignment.justify
							? [
									{
										icon: <span className={styles.iconJustify} />,
										name: 'Justify',
										pressed: active?.justify,
										onClick: () => editor.chain().focus().setTextAlign('justify').run(),
									},
								]
							: []),
					].filter(Boolean),
				]
			: []),

		...(config.contentInsertion
			? [
					[
						...(config.contentInsertion.horizontalRule
							? [
									{
										icon: <span className={styles.iconHorizontalRule} />,
										name: 'Horizontal Rule',
										pressed: active?.horizontalRule,
										onClick: () => editor.chain().focus().setHorizontalRule().run(),
									},
								]
							: []),
						...(config.contentInsertion.table
							? [
									{
										icon: <span className={styles.iconTable} />,
										name: 'Table',
										pressed: active?.table,
										onClick: () =>
											editor
												.chain()
												.focus()
												.insertTable({ rows: 4, cols: 4, withHeaderRow: true })
												.run(),
									},
								]
							: []),
						...(config.contentInsertion.youtube
							? [
									{
										custom: editor ? (
											<YouTubePopover key="youtube-popover" editor={editor} />
										) : null,
									},
								]
							: []),
						...(config.contentInsertion.image
							? [
									{
										custom: editor ? (
											<Tooltip key="image-upload">
												<Tooltip.Trigger>
													<ImageUploadButton
														editor={editor}
														maxFiles={3}
														maxSizeMB={5}
														className={styles.button}
													>
														<span className={styles.iconImage} />
													</ImageUploadButton>
												</Tooltip.Trigger>
												<Tooltip.Content>Image</Tooltip.Content>
											</Tooltip>
										) : null,
									},
								]
							: []),
					].filter(Boolean),
				]
			: []),
	].filter(group => group.length > 0)

	return (
		<main className={styles.wrapper}>
			<div className={styles.menuBar}>
				{buttonGroups.map((group, groupIndex) => (
					<div key={groupIndex} className={styles.buttonGroup}>
						{group.map((button, buttonIndex) =>
							'custom' in button ? (
								button.custom
							) : (
								<Tooltip key={buttonIndex}>
									<Tooltip.Trigger>
										<CustomButton
											type="button"
											variant="secondary"
											size="icon"
											radius="md"
											onClick={button.onClick}
											disabled={'disabled' in button ? button.disabled : undefined}
											aria-pressed={'isHistoryButton' in button ? undefined : button.pressed}
											data-active={
												'isHistoryButton' in button ? undefined : button.pressed || undefined
											}
											className={styles.button}
										>
											{button.icon}
										</CustomButton>
									</Tooltip.Trigger>
									<Tooltip.Content>{button.name}</Tooltip.Content>
								</Tooltip>
							)
						)}
					</div>
				))}
			</div>
			<span className={styles.divider} />
		</main>
	)
}

export default MenuBar
