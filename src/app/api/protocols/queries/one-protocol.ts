import { apiClient } from '@/lib/axios'
import { ProtocolType } from '@/types/Protocol.type'
import { ResponseType } from '@/types/Response.type'
import { useQuery } from '@tanstack/react-query'

export const getOneProtocol = async (id: string) => {
	try {
		const response = await apiClient.get(`/protocols/${id}`, {
			params: {
				include: 'category,author,featuredImage,tags,sources,faqs,comments,votes',
			},
		})
		const data = response.data as ResponseType<ProtocolType>
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetOneProtocol = (id: string) => {
	return useQuery<ResponseType<ProtocolType>>({
		queryKey: ['one-protocol', id],
		queryFn: () => getOneProtocol(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}
