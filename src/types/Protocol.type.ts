import type { Category } from '@/types/Category.type'
import type { Author } from '@/types/Author.type'
import type { StatusEnum, VoteTypeEnum } from '@/types/Enums'
import type { JSONContent } from '@tiptap/react'
import { FeaturedImageType } from '@/types/FeaturedImage.type'

export type ProtocolAttributesType = {
	title: string
	slug: string
	summary: string
	average_reading_time: string
	ingredients: JSONContent[]
	mechanism: JSONContent[]
	timeline: JSONContent[]
	instructions: JSONContent[]
	disclaimer: JSONContent[]
	sources: SourceType[]
	faqs: FAQsType[]
	tags: string[]
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
	created_at: string
	updated_at: string | null
	deleted_at: string | null
}

export type ProtocolType = {
	id: string
	attributes: ProtocolAttributesType
}

export type SourceType = {
	id: number
	link: string
	protocol_id: number
	deleted_at: string | null
	created_at: string
	updated_at: string | null
}

export type FAQsType = {
	id: number
	question: string
	answer: string
	protocol_id: number
	deleted_at: string | null
	created_at: string
	updated_at: string | null
}

export type CreateProtocolType = {
	title: string
	summary: string
	ingredients: JSONContent[] // TipTap content array
	mechanism: JSONContent[] // TipTap content array
	timeline: JSONContent[] // TipTap content array
	instructions: JSONContent[] // TipTap content array
	disclaimer: JSONContent[] // TipTap content array
	sources: SourceType[]
	faqs: FAQsType[]
	tags: string[]
	category_id: number
	featured_media: File | null
	author_id: number
	status: StatusEnum
}
