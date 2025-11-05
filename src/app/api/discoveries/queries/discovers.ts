import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { DiscoverType } from '@/types/Discover.type'

export const getDiscovers = async () => {
	try {
		const response = await apiClient.get('/discoveries', {
			params: {
				'page[number]': 1,
				'page[size]': 10,
				sort: '-created_at',
				include: 'primaryCategory,author,featuredImage,comments,tags,votes',
			},
		})
		const data = response.data as ResponseType<DiscoverType[]>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetDiscovers = () => {
	return useQuery<ResponseType<DiscoverType[]>>({
		queryKey: ['discoveries'],
		queryFn: getDiscovers,
	})
}
