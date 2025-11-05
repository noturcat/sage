import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateReplyType } from '@/types/Reply.ts'
import type { ReplyType } from '@/types/Reply.ts'

export const editReply = async (replyId: number, reply: CreateReplyType) => {
	try {
		const response = await apiClient.patch(`/replies/${replyId}`, {
			reply: JSON.stringify(reply.reply),
		})
		return response.data as ResponseType<ReplyType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useEditReply = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<ReplyType>, Error, { replyId: number; reply: CreateReplyType }>({
		mutationKey: ['edit-reply'],
		mutationFn: ({ replyId, reply }) => editReply(replyId, reply),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			queryClient.invalidateQueries({ queryKey: ['replies'] })
			queryClient.invalidateQueries({ queryKey: ['nested-replies'] })
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
