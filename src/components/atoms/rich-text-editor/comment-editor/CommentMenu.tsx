import { Editor, useEditorState } from '@tiptap/react'
import CustomButton from '@/components/atoms/button/CustomButton'
import ImageUploadButton from '@/components/atoms/rich-text-editor/dropzone/ImageUploadButton'
import LinkPopover from '@/components/atoms/rich-text-editor/link/LinkPopover'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import styles from './CommentMenu.module.scss'

interface CommentMenuProps {
	editor: Editor | null
}

function CommentMenu({ editor }: CommentMenuProps) {
	const active = useEditorState({
		editor,
		selector: ({ editor }) => ({
			bold: editor?.isActive('bold') ?? false,
			italic: editor?.isActive('italic') ?? false,
			underline: editor?.isActive('underline') ?? false,
			code: editor?.isActive('code') ?? false,
			link: editor?.isActive('link') ?? false,
			image: editor?.isActive('image') ?? false,
		}),
	})

	if (!editor) return null

	const buttonGroups = [
		// Text formatting group
		[
			{
				icon: <span className={styles.iconBold} />,
				name: 'Bold',
				pressed: active?.bold,
				onClick: () => editor.chain().focus().toggleBold().run(),
			},
			{
				icon: <span className={styles.iconItalic} />,
				name: 'Italic',
				pressed: active?.italic,
				onClick: () => editor.chain().focus().toggleItalic().run(),
			},
			{
				icon: <span className={styles.iconUnderline} />,
				name: 'Underline',
				pressed: active?.underline,
				onClick: () => editor.chain().focus().toggleUnderline().run(),
			},
			{
				icon: <span className={styles.iconCode} />,
				name: 'Code',
				pressed: active?.code,
				onClick: () => editor.chain().focus().toggleCode().run(),
			},
			{
				custom: editor ? <LinkPopover key="link-popover" editor={editor} /> : null,
			},
		],
		// Content insertion group
		[
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
		],
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
											aria-pressed={button.pressed}
											data-active={button.pressed || undefined}
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
		</main>
	)
}

export default CommentMenu
