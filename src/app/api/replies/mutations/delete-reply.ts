import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { ReplyType } from '@/types/Reply.ts'

export const deleteReply = async (replyId: number) => {
	try {
		const response = await apiClient.delete(`/replies/${replyId}`)
		return response.data as ResponseType<ReplyType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useDeleteReply = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<ReplyType>, Error, { replyId: number }>({
		mutationKey: ['delete-reply'],
		mutationFn: ({ replyId }) => deleteReply(replyId),
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
