import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateReplyType, ReplyType } from '@/types/Reply.ts'

export const createReply = async (commentId: number, reply: CreateReplyType) => {
	try {
		const response = await apiClient.post(`/comments/${commentId}/replies`, {
			reply: JSON.stringify(reply.reply),
		})
		return response.data as ResponseType<ReplyType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateReply = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<ReplyType>, Error, { commentId: number; reply: CreateReplyType }>(
		{
			mutationKey: ['create-reply'],
			mutationFn: ({ commentId, reply }) => createReply(commentId, reply),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['replies'] })
				queryClient.invalidateQueries({ queryKey: ['nested-replies'] })
				queryClient.invalidateQueries({ queryKey: ['comments'] })
				onSuccess?.()
			},
			onError: error => {
				console.error(error.message)
			},
		}
	)
}
