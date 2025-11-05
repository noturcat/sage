import { JSONContent } from '@tiptap/react'
import { Category } from '@/types/Category.type'
import { Author } from '@/types/Author.type'
import { StatusEnum, VoteTypeEnum } from '@/types/Enums'
import { FeaturedImageType } from '@/types/FeaturedImage.type'

export type DiscoverAttributesType = {
	title: string
	slug: string
	content: JSONContent[]
	summary: string
	average_reading_time: string
	visits: number
	status: StatusEnum
	published_date: string | null
	primary_category: Category
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

export type DiscoverType = {
	id: number
	attributes: DiscoverAttributesType
}

export type CreateDiscoverType = {
	title: string
	content: JSONContent[]
	summary: string
	average_reading_time: string
	primary_category_id: number
	featured_media: File | null
	author_id: number
	status: StatusEnum
}
