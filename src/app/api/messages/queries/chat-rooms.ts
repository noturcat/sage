import { apiClient } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import type { ResponseType } from '@/types/Response.type'
import type { ChatRoomType } from '@/types/ChatRoom.type'

export const getChatRooms = async (
	type: 'all' | 'unread' | 'requests' = 'all',
	search?: string
) => {
	try {
		const params: Record<string, string | number> = {}

		params.per_page = 100

		if (type === 'requests') {
			params.type = 'chat_request'
		}

		// Only include search if it has a value
		if (search && typeof search === 'string' && search.trim().length > 0) {
			params.search = search.trim()
		}

		const response = await apiClient.get('/chat-rooms', {
			params,
		})

		const result = response.data as ResponseType<ChatRoomType[]>
		return result.data || []
	} catch (error) {
		console.error('Error fetching chat rooms:', error)
		throw error
	}
}

export const useGetChatRooms = (type: 'all' | 'unread' | 'requests' = 'all', search?: string) => {
	return useQuery<ChatRoomType[]>({
		queryKey: ['chat-rooms', type, search],
		queryFn: () => getChatRooms(type, search),
	})
}

export const getChatRoom = async (chatRoomId: string) => {
	try {
		const response = await apiClient.get(`/chat-rooms/${chatRoomId}`)

		const result = response.data as ResponseType<ChatRoomType>
		return result.data
	} catch (error) {
		console.error('Error fetching chat room:', error)
		throw error
	}
}

export const useGetChatRoom = (chatRoomId: string | undefined) => {
	return useQuery<ChatRoomType | undefined>({
		queryKey: ['chat-room', chatRoomId],
		queryFn: () => (chatRoomId ? getChatRoom(chatRoomId) : undefined),
		enabled: !!chatRoomId,
	})
}
