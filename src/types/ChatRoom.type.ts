export type ChatRoomUserType = {
	id: number | string
	first_name: string
	middle_name?: string | null
	last_name: string
	username: string
	email: string
	avatar_id?: number | string | null
	pivot?: {
		chat_room_id: string
		user_id: number
		role: string
		joined_at: string
		created_at: string
		updated_at: string
	}
}

export type ChatRoomMessageSenderType = {
	id: number | string
	attributes: {
		first_name: string
		middle_name?: string | null
		last_name: string
		username: string
		email: string
		avatar_id?: number | string | null
		gender?: string | null
		is_verified?: boolean
		is_active?: boolean
		slug?: string
		bio?: string | null
		email_verified_at?: string | null
		created_at?: string
		updated_at?: string
	}
}

export type ChatRoomMessageAttributesType = {
	message: string
	message_type: string
	sender: ChatRoomMessageSenderType
	chat_room_id: string
	reply_to_message_id?: number | string | null
	reply_to_message?: ChatRoomMessageType | null
	replies?: ChatRoomMessageType[]
	edited_at?: string | null
	seen_at?: string | null
	seen_by?: unknown
	created_at: string
	updated_at: string
	deleted_at?: string | null
}

export type ChatRoomMessageType = {
	id: number | string
	attributes: ChatRoomMessageAttributesType
}

export type ChatRoomAttributesType = {
	name?: string | null
	type?: string | null
	creator?: ChatRoomUserType | null
	users?: ChatRoomUserType[]
	messages?: ChatRoomMessageType[]
	created_at?: string | null
	updated_at?: string | null
	deleted_at?: string | null
}

export type ChatRoomType = {
	id: string
	attributes: ChatRoomAttributesType
}

export type CreateChatRoomType = {
	name?: string | null
	type?: string | null
	user_ids?: number[]
}
