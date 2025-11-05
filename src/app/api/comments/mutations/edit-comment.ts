import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CommentType } from '@/types/Comment.type'
import type { JSONContent } from '@tiptap/react'

export const editComment = async (commentId: number, comment: JSONContent[]) => {
	try {
		const response = await apiClient.patch(`/comments/${commentId}`, {
			comment: JSON.stringify(comment),
		})
		return response.data as ResponseType<CommentType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useEditComment = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation<
		ResponseType<CommentType>,
		Error,
		{ commentId: number; comment: JSONContent[] }
	>({
		mutationKey: ['edit-comment'],
		mutationFn: ({ commentId, comment }) => editComment(commentId, comment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
