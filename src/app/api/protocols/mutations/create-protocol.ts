import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateProtocolType, ProtocolType } from '@/types/Protocol.type'

export const createProtocol = async (protocol: CreateProtocolType) => {
	try {
		const formData = new FormData()

		if (protocol.featured_media instanceof File) {
			formData.append('featured_media', protocol.featured_media)
		}

		formData.append('category_id', String(protocol.category_id))
		formData.append('title', protocol.title)
		formData.append('summary', protocol.summary)
		formData.append('author_id', String(protocol.author_id))
		formData.append('status', protocol.status)
		formData.append('ingredients', JSON.stringify(protocol.ingredients))
		formData.append('mechanism', JSON.stringify(protocol.mechanism))
		formData.append('timeline', JSON.stringify(protocol.timeline))
		formData.append('instructions', JSON.stringify(protocol.instructions))

		if (protocol.disclaimer && protocol.disclaimer.length > 0) {
			formData.append('disclaimer', JSON.stringify(protocol.disclaimer))
		}

		// Append array fields using modern approach
		protocol.sources?.forEach((source, index) => {
			formData.append(`sources[${index}][link]`, source.link)
		})

		protocol.faqs?.forEach((faq, index) => {
			formData.append(`faqs[${index}][question]`, faq.question)
			formData.append(`faqs[${index}][answer]`, faq.answer)
		})

		protocol.tags?.forEach((tag, index) => {
			formData.append(`tags[${index}]`, tag)
		})

		const response = await apiClient.post('/protocols', formData)
		return response.data as ResponseType<ProtocolType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useCreateProtocol = (onSuccess?: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-protocol'],
		mutationFn: createProtocol,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['protocols'] })
			queryClient.invalidateQueries({ queryKey: ['one-protocol'] })
			onSuccess?.()
		},
		onError: error => {
			console.error('Protocol creation failed:', error)
		},
	})
}
