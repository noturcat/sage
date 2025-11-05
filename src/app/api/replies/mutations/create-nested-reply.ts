import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateReplyType, ReplyType } from '@/types/Reply.ts'

export const createNestedReply = async (replyId: number, reply: CreateReplyType) => {
	try {
		const response = await apiClient.post(`/replies/${replyId}/children`, {
			reply: JSON.stringify(reply.reply),
		})
		return response.data as ResponseType<ReplyType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateNestedReply = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<ReplyType>, Error, { replyId: number; reply: CreateReplyType }>({
		mutationKey: ['create-nested-reply'],
		mutationFn: ({ replyId, reply }) => createNestedReply(replyId, reply),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nested-replies'] })
			queryClient.invalidateQueries({ queryKey: ['replies'] })
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
