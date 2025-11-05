export type CategoryAttributesType = {
	name: string
	slug: string
	description?: string
	is_published: boolean
	created_at: Date | string
	updated_at: Date | string
}

export type ParentType = CategoryAttributesType & {
	id: number
}

export type CategoryType = {
	id: number
	attributes: CategoryAttributesType
	parent?: ParentType
}

export type Category = CategoryAttributesType & {
	id: number
}
