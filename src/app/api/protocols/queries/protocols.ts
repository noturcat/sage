import { apiClient } from '@/lib/axios'
import { ProtocolType } from '@/types/Protocol.type'
import { ResponseType } from '@/types/Response.type'
import { useQuery } from '@tanstack/react-query'

export const getProtocols = async () => {
	try {
		const response = await apiClient.get('/protocols', {
			params: {
				'page[number]': 1,
				'page[size]': 10,
				sort: '-created_at',
				include: 'category,author,featuredImage,tags,sources,faqs,comments,votes',
			},
		})
		const data = response.data as ResponseType<ProtocolType[]>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetProtocols = () => {
	return useQuery<ResponseType<ProtocolType[]>>({
		queryKey: ['protocols'],
		queryFn: getProtocols,
	})
}
