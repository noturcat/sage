import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CommentType } from '@/types/Comment.type'
import { useQuery } from '@tanstack/react-query'

export const getComments = async (id: number, type: string) => {
	try {
		const response = await apiClient.get('/comments', {
			params: {
				'page[number]': 1,
				'page[size]': 10,
				include: 'replies,user,votes',
				'filter[commentable_id]': id,
				'filter[commentable_type]': type,
				sort: '-created_at',
			},
		})

		const data = response.data as ResponseType<CommentType[]>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetComments = (id: number, type: string) => {
	return useQuery<ResponseType<CommentType[]>>({
		queryKey: ['comments', id, type],
		queryFn: () => getComments(id, type),
	})
}
