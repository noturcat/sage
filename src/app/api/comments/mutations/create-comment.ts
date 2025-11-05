import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateCommentType } from '@/types/Comment.type'
import type { CommentType } from '@/types/Comment.type'

export const createComment = async (content: CreateCommentType) => {
	try {
		const response = await apiClient.post('/comments', {
			commentable_id: content.commentable_id,
			commentable_type: content.commentable_type,
			comment: JSON.stringify(content.comment),
		})
		return response.data as ResponseType<CommentType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateComment = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<ResponseType<CommentType>, Error, { content: CreateCommentType }>({
		mutationKey: ['create-comment'],
		mutationFn: ({ content }) => createComment(content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
