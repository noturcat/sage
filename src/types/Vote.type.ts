import { VoteTypeEnum, VoteableTypeEnum } from '@/types/Enums'

export type RoleType = {
	id: number
	name: string
	guard_name: string
	created_at: string
	updated_at: string
	pivot: {
		model_type: string
		model_id: number
		role_id: number
	}
}

export type VoterType = {
	id: number
	first_name: string
	middle_name: string | null
	last_name: string
	bio: string | null
	slug: string
	username: string
	email: string
	email_verified_at: string
	gender: string
	is_verified: boolean
	is_active: boolean
	created_at: string
	updated_at: string
	avatar_id: number | null
	role_names: string[]
	roles: RoleType[]
}

export type VoteAttributesType = {
	voteable_id: number
	voteable_type: string
	vote_type: string
	voter: VoterType
	created_at: string
	updated_at: string
}

export type VoteType = {
	id: string
	attributes: VoteAttributesType
}

export type CreateVoteType = {
	voteable_id: number
	voteable_type: VoteableTypeEnum
	vote_type: VoteTypeEnum
}
