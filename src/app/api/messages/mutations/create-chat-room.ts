import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateChatRoomType } from '@/types/ChatRoom.type'
import type { ChatRoomType } from '@/types/ChatRoom.type'

export const createChatRoom = async (chatRoom: CreateChatRoomType) => {
	try {
		const response = await apiClient.post('/chat-rooms', {
			name: chatRoom.name,
			type: chatRoom.type,
			user_ids: chatRoom.user_ids,
		})
		return response.data as ResponseType<ChatRoomType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateChatRoom = (onSuccess?: (chatRoomId: string) => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<ChatRoomType>, Error, { chatRoom: CreateChatRoomType }>({
		mutationKey: ['create-chat-room'],
		mutationFn: ({ chatRoom }) => createChatRoom(chatRoom),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['chat-rooms'] })
			queryClient.invalidateQueries({ queryKey: ['users', 'suggestions'] })
			if (data.data?.id && onSuccess) {
				onSuccess(data.data.id)
			}
		},
		onError: error => {
			console.error(error.message)
		},
	})
}

