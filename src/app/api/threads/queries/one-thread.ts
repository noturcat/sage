import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { ThreadType } from '@/types/Thread.type'

export const getOneThread = async (id: string) => {
	try {
		const response = await apiClient.get(`/threads/${id}`, {
			params: {
				include: 'category,author,featuredImage,comments,tags,votes',
			},
		})
		const data = response.data as ResponseType<ThreadType>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetOneThread = (id: string) => {
	return useQuery<ResponseType<ThreadType>>({
		queryKey: ['one-thread', id],
		queryFn: () => getOneThread(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}
