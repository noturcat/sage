import { apiClient } from '@/lib/axios'
import { CategoryType } from '@/types/Category.type'
import { ResponseType } from '@/types/Response.type'
import { useQuery } from '@tanstack/react-query'

export const getCategories = async () => {
	try {
		const response = await apiClient.get('/categories', {
			params: {
				'page[number]': 1,
				'page[size]': 100,
			},
		})
		const data = response.data as ResponseType<CategoryType[]>
		return data
	} catch (error) {
		throw error
	}
}

export const useGetCategories = () => {
	return useQuery<ResponseType<CategoryType[]>>({
		queryKey: ['categories'],
		queryFn: getCategories,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}
