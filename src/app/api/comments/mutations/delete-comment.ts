import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CommentType } from '@/types/Comment.type'

export const deleteComment = async (commentId: number) => {
	try {
		const response = await apiClient.delete(`/comments/${commentId}`)
		return response.data as ResponseType<CommentType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useDeleteComment = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<CommentType>, Error, { commentId: number }>({
		mutationKey: ['delete-comment'],
		mutationFn: ({ commentId }) => deleteComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
