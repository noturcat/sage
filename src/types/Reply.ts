import type { Author } from '@/types/Author.type'
import type { JSONContent } from '@tiptap/react'
import type { VoteTypeEnum } from './Enums'

export type ReplyAttributesType = {
	comment_id: number
	parent_id: number | null
	reply_to_id: number | null
	reply: JSONContent[]
	author: Author
	children: ReplyType[]
	children_count: number
	votes_score: number
	upvotes_count: number
	downvotes_count: number
	user_vote: VoteTypeEnum | null
	created_at: string
	updated_at: string
	deleted_at: string | null
}

export type ReplyType = {
	id: string
	attributes: ReplyAttributesType
}

export type CreateReplyType = {
	reply: JSONContent[]
}
