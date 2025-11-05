import { JSONContent } from '@tiptap/react'
import RichCommentEditor from '@/components/atoms/rich-text-editor/comment-editor/RichCommentEditor'
import style from './Reply.module.scss'

/**
 * **Reply component** for nested comment replies.
 *
 * Manages nested comment replies with a tree-like structure.
 * Features dynamic expansion of replies, truncation detection, and nested reply display.
 *
 * Example:
 * ```tsx
 * <Reply
 *   placeholder="Add a reply"
 *   initialContent="This is a reply"
 *   onUpdateHTML={onUpdateHTML}
 * />
 * ```
 *
 * Notes:
 * - Provides an input field for users to compose and submit replies.
 * - Supports rich text editing with TipTap.
 * - Provides a clear and consistent UI for nested comment replies.
 */

interface ReplyProps {
	content?: { type: 'doc'; content?: JSONContent[] } | JSONContent[] | string | null
	onContentChange?: (
		content: { type: 'doc'; content?: JSONContent[] } | JSONContent[] | null
	) => void
	onSendReply?: () => void
}

function Reply({ content, onContentChange, onSendReply }: ReplyProps) {
	return (
		<article className={style.card}>
			<div className={style.editor}>
				<RichCommentEditor
					content={content}
					onContentChange={onContentChange}
					handleSendComment={onSendReply}
				/>
			</div>
		</article>
	)
}

export default Reply
