export type Category =
	| 'All'
	| 'Directories'
	| 'Listings'
	| 'Protocols'
	| 'Groups'
	| 'Pages'
	| 'Threads'
	| 'Discoveries'
	| 'Videos'
	| 'Events'
	| 'People'
	| 'Posts'

export type SearchItem = {
	id?: string
	title: string
	subtitle?: string
	href: string
	url?: string
	icon?: string
	category: Category
	type?: string
	description?: string
	content?: string
	image?: string
	badge?: string
	avatarUrl?: string
	thumbnailUrl?: string
	highlight?: {
		content?: string[]
		title?: string[]
		description?: string[]
	}
	score?: number
}

export type TypesenseHighlight = {
	field: string
	snippet: string
	value?: string
}

export type GenericDoc = {
	title?: string
	name?: string
	company_name?: string
	slug?: string
	subtitle?: string
	href?: string
	url?: string
	icon?: string
	category?: Category
	description?: string
	image?: string
	badge?: string
	website?: string
	email?: string
	phone?: string
	avatar_url?: string
	thumbnail_url?: string
	first_name?: string
	middle_name?: string
	last_name?: string
	bio?: string
}

export type TypesenseHit = {
	document: GenericDoc
	highlights?: TypesenseHighlight[]
}

export type TypesenseMultiSearchResult = {
	request_params?: { collection?: string }
	hits?: TypesenseHit[]
}

export type TypesenseMultiSearchResponse = {
	results: TypesenseMultiSearchResult[]
}

export type Props = {
	open: boolean
	onClose: () => void
}
