import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { ReplyType } from '@/types/Reply.ts'
import { useQuery, useQueries } from '@tanstack/react-query'

export const getReplies = async (commentId: number) => {
	try {
		const response = await apiClient.get(`/comments/${commentId}/replies`, {
			params: {
				include: 'user,votes',
			},
		})
		const data = response.data as ResponseType<ReplyType[]>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetReplies = (commentId: number, enabled: boolean = true) => {
	return useQuery<ResponseType<ReplyType[]>>({
		queryKey: ['replies', commentId],
		queryFn: () => getReplies(commentId),
		enabled: enabled && !!commentId,
	})
}

export const useGetMultipleReplies = (commentIds: number[]) => {
	return useQueries({
		queries: commentIds.map(commentId => ({
			queryKey: ['replies', commentId],
			queryFn: () => getReplies(commentId),
			enabled: !!commentId,
		})),
	})
}
