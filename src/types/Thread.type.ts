import { JSONContent } from '@tiptap/react'
import { Category } from '@/types/Category.type'
import { Author } from '@/types/Author.type'
import { StatusEnum, VoteTypeEnum } from '@/types/Enums'
import { FeaturedImageType } from '@/types/FeaturedImage.type'

export type ThreadAttributesType = {
	title: string
	slug: string
	summary: string
	average_reading_time: string
	content: JSONContent[] | Record<string, string> // Backend sometimes sends object instead of TipTap array
	status: StatusEnum
	published_date: string | null
	category: Category
	author: Author
	featured_image: FeaturedImageType | null
	comments_count: number
	replies_count: number
	votes_score: number
	upvotes_count: number
	downvotes_count: number
	user_vote: VoteTypeEnum | null
	tags: string[]
	created_at: string
	updated_at: string | null
	deleted_at: string | null
}

export type ThreadType = {
	id: number
	attributes: ThreadAttributesType
}

export type CreateThreadType = {
	title: string
	content: JSONContent[]
	summary: string
	average_reading_time: string
	category_id: number
	featured_media: File | null
	author_id: number
	status: StatusEnum
}
