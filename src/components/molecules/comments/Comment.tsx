import { JSONContent } from '@tiptap/react'
import Avatar from '@/components/atoms/avatar/Avatar'
import RichCommentEditor from '@/components/atoms/rich-text-editor/comment-editor/RichCommentEditor'
import { UserType } from '@/types/User.type'

import style from './Comment.module.scss'

/**
 * **Comment component** for displaying a comment.
 *
 * Displays a comment with a user avatar, name, time, content, and replies.
 *
 * Example:
 * ```tsx
 * <Comment
 *   placeholder="Add a comment"
 *   initialContent="This is a comment"
 *   onUpdateHTML={onUpdateHTML}
 * />
 * ```
 *
 * Notes:
 * - Displays a comment with a user avatar, name, time, and content.
 * - Supports rich text editing with TipTap.
 * - Provides a clear and consistent UI for displaying a comment.
 */

interface CommentProps {
	content?: { type: 'doc'; content?: JSONContent[] } | JSONContent[] | string | null
	onContentChange?: (
		content: { type: 'doc'; content?: JSONContent[] } | JSONContent[] | null
	) => void
	onSendComment?: () => void
	onCancel?: () => void
	isEditing?: boolean
	author?: UserType
}

function Comment({
	content,
	onContentChange,
	onSendComment,
	onCancel,
	isEditing = false,
	author,
}: CommentProps) {
	return (
		<div className={style.comment}>
			<Avatar src="/images/avatar-placeholder.png" alt="Avatar" size={42} />
			<div className={style.card}>
				<p className={style.name}>
					{author?.first_name} {author?.last_name}
				</p>
				<div className={style.editor}>
					<RichCommentEditor
						content={content}
						onContentChange={onContentChange}
						handleSendComment={onSendComment}
					/>
					{isEditing && onCancel && (
						<div className={style.editActions}>
							<button className={style.cancelButton} onClick={onCancel} type="button">
								Cancel
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Comment
