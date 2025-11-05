export type AuthorAttributesType = {
	first_name: string
	middle_name: string | null
	last_name: string
	username: string
	email: string
	gender: string
	is_verified: boolean
	is_active: boolean
	slug: string
	bio: string | null
	email_verified_at: string
	created_at: string
	updated_at: string
}

export type AuthorType = {
	id: string
	attributes: AuthorAttributesType
}

/**
 * Author type for comments and replies
 */
export type Author = AuthorAttributesType & {
	id: string
}
