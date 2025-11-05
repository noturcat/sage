import {
	ChatRoomChannel,
	MessageDeletedEvent,
	MessageEditedEvent,
	MessageEvent,
	MessageReactionEvent,
	MessageSentEvent,
	TypingIndicatorEvent,
	UserChannel,
} from './types'

// Chat room listener functions with type safety
export class ChatRoomListener {
	private channel: ReturnType<typeof window.Echo.private>

	constructor(chatRoomId: string) {
		if (typeof window === 'undefined' || !window.Echo) {
			throw new Error('Echo is not initialized. Make sure you are in a browser environment.')
		}
		this.channel = window.Echo.private(`chat-room.${chatRoomId}` as ChatRoomChannel)
	}

	// Listen for new messages
	onMessageSent(callback: (event: MessageSentEvent) => void): ChatRoomListener {
		this.channel.listen('.message.sent', callback)
		return this
	}

	// Listen for message edits
	onMessageEdited(callback: (event: MessageEditedEvent) => void): ChatRoomListener {
		this.channel.listen('.message.edited', callback)
		return this
	}

	// Listen for message deletions
	onMessageDeleted(callback: (event: MessageDeletedEvent) => void): ChatRoomListener {
		this.channel.listen('.message.deleted', callback)
		return this
	}

	// Listen for typing indicators
	onTypingIndicator(callback: (event: TypingIndicatorEvent) => void): ChatRoomListener {
		this.channel.listen('.typing.indicator', callback)
		return this
	}

	// Listen for reaction events
	onReactionEvent(callback: (event: MessageReactionEvent) => void): ChatRoomListener {
		this.channel.listen('.message.reaction.added', callback)
		this.channel.listen('.message.reaction.removed', callback)
		return this
	}

	// Listen for all message events
	onMessageEvent(callback: (event: MessageEvent) => void): ChatRoomListener {
		this.channel
			.listen('.message.sent', callback)
			.listen('.message.edited', callback)
			.listen('.message.deleted', callback)
		return this
	}

	// Stop listening to the channel
	stopListening(): void {
		this.channel.stopListening('.message.sent')
		this.channel.stopListening('.message.edited')
		this.channel.stopListening('.message.deleted')
		this.channel.stopListening('.message.reaction.added')
		this.channel.stopListening('.message.reaction.removed')
		this.channel.stopListening('.typing.indicator')
	}

	// Leave the channel
	leave(): void {
		this.stopListening()
	}
}

// User channel listener for user-specific events
export class UserChannelListener {
	private channel: ReturnType<typeof window.Echo.private>

	constructor(userId: number) {
		if (typeof window === 'undefined' || !window.Echo) {
			throw new Error('Echo is not initialized. Make sure you are in a browser environment.')
		}
		this.channel = window.Echo.private(`App.Models.User.${userId}` as UserChannel)

		// Add subscription debugging
		this.channel.subscribed(() => {
			console.log('Successfully subscribed to user channel:', `App.Models.User.${userId}`)
		})

		this.channel.error((error: Error) => {
			console.error('User channel subscription error:', error)
		})
	}

	// Stop listening to the channel
	stopListening(): void {
		// Add any user-specific event listeners here in the future
	}

	// Leave the channel
	leave(): void {
		this.stopListening()
	}
}

// Factory function to create a chat room listener
export const createChatRoomListener = (chatRoomId: string): ChatRoomListener => {
	return new ChatRoomListener(chatRoomId)
}

// Factory function to create a user channel listener
export const createUserChannelListener = (userId: number): UserChannelListener => {
	return new UserChannelListener(userId)
}
