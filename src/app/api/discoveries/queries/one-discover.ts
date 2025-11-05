import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { DiscoverType } from '@/types/Discover.type'

export const getOneDiscover = async (id: string) => {
	try {
		const response = await apiClient.get(`/discoveries/${id}`, {
			params: {
				include: 'primaryCategory,author,featuredImage,comments,tags,votes',
			},
		})
		const data = response.data as ResponseType<DiscoverType>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetOneDiscover = (id: string) => {
	return useQuery<ResponseType<DiscoverType>>({
		queryKey: ['one-discovery', id],
		queryFn: () => getOneDiscover(id),
		enabled: !!id,
	})
}
