import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateThreadType } from '@/types/Thread.type'
import type { ThreadType } from '@/types/Thread.type'

export const createThread = async (thread: CreateThreadType) => {
	try {
		const formData = new FormData()

		if (thread.featured_media instanceof File) {
			formData.append('featured_media', thread.featured_media)
		}

		formData.append('title', thread.title)
		formData.append('content', JSON.stringify(thread.content))
		formData.append('summary', thread.summary)
		formData.append('average_reading_time', thread.average_reading_time)
		formData.append('category_id', String(thread.category_id))
		formData.append('author_id', String(thread.author_id))
		formData.append('status', thread.status)

		const response = await apiClient.post('/threads', formData)
		return response.data as ResponseType<ThreadType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateThread = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-thread'],
		mutationFn: createThread,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['threads'] })
			queryClient.invalidateQueries({ queryKey: ['one-thread'] })
			onSuccess?.()
		},
		onError: error => {
			console.error('Thread creation failed:', error)
		},
	})
}
