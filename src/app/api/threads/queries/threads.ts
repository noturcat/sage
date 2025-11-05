import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { ThreadType } from '@/types/Thread.type'

export const getThreads = async () => {
	try {
		const response = await apiClient.get('/threads', {
			params: {
				'page[number]': 1,
				'page[size]': 10,
				sort: '-created_at',
				include: 'category,author,featuredImage,comments,tags,votes',
			},
		})
		const data = response.data as ResponseType<ThreadType[]>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetThreads = () => {
	return useQuery<ResponseType<ThreadType[]>>({
		queryKey: ['threads'],
		queryFn: getThreads,
	})
}
