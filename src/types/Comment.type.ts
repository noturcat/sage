import type { Author } from '@/types/Author.type'
import type { JSONContent } from '@tiptap/react'
import { CommentableTypeEnum, VoteTypeEnum } from '@/types/Enums'

export type CommentAttributesType = {
	commentable_id: number
	commentable_type: string
	comment: JSONContent[]
	author: Author
	replies_count: number
	votes_score: number
	upvotes_count: number
	downvotes_count: number
	user_vote: VoteTypeEnum | null
	created_at: string
	updated_at: string
	deleted_at: string | null
}

export type CommentType = {
	id: string
	attributes: CommentAttributesType
}

export type CreateCommentType = {
	commentable_id: number
	commentable_type: CommentableTypeEnum
	comment: JSONContent[]
}
