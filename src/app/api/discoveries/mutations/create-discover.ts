import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateDiscoverType } from '@/types/Discover.type'
import type { DiscoverType } from '@/types/Discover.type'

export const createDiscover = async (discover: CreateDiscoverType) => {
	try {
		const formData = new FormData()

		if (discover.featured_media instanceof File) {
			formData.append('featured_media', discover.featured_media)
		}

		formData.append('title', discover.title)
		formData.append('content', JSON.stringify(discover.content))
		formData.append('summary', discover.summary)
		formData.append('average_reading_time', discover.average_reading_time)
		formData.append('primary_category_id', String(discover.primary_category_id))
		formData.append('author_id', String(discover.author_id))
		formData.append('status', discover.status)

		const response = await apiClient.post('/discoveries', formData)
		return response.data as ResponseType<DiscoverType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateDiscover = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-discover'],
		mutationFn: createDiscover,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['one-discovery'] })
			queryClient.invalidateQueries({ queryKey: ['discoveries'] })
			onSuccess?.()
		},
		onError: error => {
			console.error('Discover creation failed:', error)
		},
	})
}
