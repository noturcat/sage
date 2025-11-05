export type LinkType = {
	first: string
	last: string
	prev: string
	next: string
}

export type MetaLinkType = {
	url: string
	label: string
	page: number
	active: boolean
}

export type MetaType = {
	current_page: number
	from: number
	last_page: number
	links: MetaLinkType[]
	path: string
	per_page: number
	to: number
	total: number
}

export type ResponseType<T = unknown> = {
	data?: T
	links?: LinkType
	meta?: MetaType
}
