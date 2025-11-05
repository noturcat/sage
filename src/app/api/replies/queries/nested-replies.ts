import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { ReplyType } from '@/types/Reply.ts'
import { useQuery } from '@tanstack/react-query'

export const getNestedReplies = async (replyId: number) => {
	try {
		const response = await apiClient.get(`/replies/${replyId}/children`, {
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

export const useGetNestedReplies = (replyId: number, enabled: boolean = true) => {
	return useQuery<ResponseType<ReplyType[]>>({
		queryKey: ['nested-replies', replyId],
		queryFn: () => getNestedReplies(replyId),
		enabled: enabled && !!replyId,
	})
}
