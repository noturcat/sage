import {
	ChatMessageTypeEnum,
	ChatReactionTypeEnum,
	MessageActionEnum,
	ReactionActionEnum,
} from '../../types/Enums'

// Re-export enums for convenience
export { ChatMessageTypeEnum, ChatReactionTypeEnum, MessageActionEnum, ReactionActionEnum }

// Message types for type safety
export interface ChatMessage {
	id: number
	message: string
	message_type: ChatMessageTypeEnum
	reply_to_message_id?: number | null
	sender_id: number
	sender_name: string | null
	chat_room_id: string
	reply_to_message?: {
		id: number
		sender_id: number
		sender_name: string
		message: string
		message_type: ChatMessageTypeEnum
		created_at: string
		edited_at: string | null
	} | null
	edited_at: string | null
	created_at: string
	updated_at: string
}

// Event types for real-time events
export interface MessageSentEvent {
	message: ChatMessage
	action: MessageActionEnum.SENT
}

export interface MessageEditedEvent {
	message: ChatMessage
	action: MessageActionEnum.EDITED
}

export interface MessageDeletedEvent {
	message: ChatMessage
	action: MessageActionEnum.DELETED
}

// Reaction event types
export interface MessageReactionEvent {
	message_id: number
	reaction: {
		id: number
		user_id: number
		user_name: string
		reaction_type: ChatReactionTypeEnum
		created_at: string
	}
	reactions_summary: Record<string, number>
	action: ReactionActionEnum.ADDED | ReactionActionEnum.REMOVED
}

// Typing indicator event types
export interface TypingIndicatorEvent {
	user: {
		id: number
		name: string
	}
	chat_room_id: string
	is_typing: boolean
	timestamp: string
}

// Union type for all possible message events
export type MessageEvent = MessageSentEvent | MessageEditedEvent | MessageDeletedEvent

// Echo configuration interface
export interface EchoConfig {
	broadcaster: 'reverb'
	key: string
	wsHost: string
	wsPort: number
	wssPort: number
	forceTLS: boolean
	enabledTransports: ('ws' | 'wss')[]
	authEndpoint?: string
	auth?: {
		headers: {
			Authorization: string
		}
	}
}

// Chat room channel type
export type ChatRoomChannel = `chat-room.${string}`

// User channel type
export type UserChannel = `App.Models.User.${number}`

