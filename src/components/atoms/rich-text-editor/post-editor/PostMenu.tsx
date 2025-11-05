import { Editor } from '@tiptap/react'
import ImageUploadButton from '@/components/atoms/rich-text-editor/dropzone/ImageUploadButton'
import LinkPopover from '@/components/atoms/rich-text-editor/link/LinkPopover'
import EmojiPopover from '@/components/atoms/rich-text-editor/emoji/EmojiPopover'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import YouTubePopover from '../youtube/YouTubePopover'

import styles from './PostMenu.module.scss'

interface PostMenuProps {
	editor: Editor | null
}

function PostMenu({ editor }: PostMenuProps) {
	if (!editor) return null

	const buttonGroups = [
		{
			custom: editor ? <EmojiPopover key="emoji-popover" editor={editor} /> : null,
		},
		{
			custom: editor ? (
				<Tooltip key="image-upload">
					<Tooltip.Trigger>
						<ImageUploadButton editor={editor} maxFiles={3} maxSizeMB={5} className={styles.button}>
							<span className={styles.iconImage} />
						</ImageUploadButton>
					</Tooltip.Trigger>
					<Tooltip.Content>Image</Tooltip.Content>
				</Tooltip>
			) : null,
		},
		{
			custom: editor ? <YouTubePopover key="youtube-popover" editor={editor} /> : null,
		},
		{
			custom: editor ? <LinkPopover key="link-popover" editor={editor} /> : null,
		},
	]

	return (
		<main className={styles.wrapper}>
			<div className={styles.menuBar}>
				{buttonGroups.map((group, groupIndex) => (
					<div key={groupIndex} className={styles.buttonGroup}>
						{group.custom}
					</div>
				))}
			</div>
		</main>
	)
}

export default PostMenu
