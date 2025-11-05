import { apiClient } from '@/lib/axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { ResponseType } from '@/types/Response.type'
import type { ChatRoomMessageType } from '@/types/ChatRoom.type'

export const getChatMessages = async (chatRoomId: string, page: number = 1) => {
	try {
		const response = await apiClient.get(`/chat-rooms/${chatRoomId}/messages`, {
			params: {
				per_page: 15,
				page,
			},
		})
		const result = response.data as ResponseType<ChatRoomMessageType[]>
		return {
			data: result.data || [],
			meta: result.meta,
		}
	} catch (error) {
		console.error('Error fetching chat messages:', error)
		throw error
	}
}

export const useGetChatMessages = (chatRoomId: string | undefined) => {
	return useInfiniteQuery<{
		data: ChatRoomMessageType[]
		meta?: ResponseType['meta']
	}>({
		queryKey: ['chat-messages', chatRoomId],
		queryFn: ({ pageParam = 1 }) => getChatMessages(chatRoomId!, pageParam as number),
		getNextPageParam: lastPage => {
			if (!lastPage.meta) return undefined
			return lastPage.meta.current_page < lastPage.meta.last_page
				? lastPage.meta.current_page + 1
				: undefined
		},
		initialPageParam: 1,
		enabled: !!chatRoomId,
	})
}
