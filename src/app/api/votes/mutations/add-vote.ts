import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import type { ResponseType } from '@/types/Response.type'
import type { CreateVoteType, VoteType } from '@/types/Vote.type'

export const addVote = async (vote: CreateVoteType) => {
	try {
		const response = await apiClient.post('/votes', vote)
		return response.data as ResponseType<VoteType>
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useAddVote = (onSuccess?: () => void) => {
	return useMutation<ResponseType<VoteType>, Error, { vote: CreateVoteType }>({
		mutationKey: ['add-vote'],
		mutationFn: ({ vote }) => addVote(vote),
		onSuccess: () => {
			onSuccess?.()
		},
		onError: error => {
			console.error(error.message)
		},
	})
}
