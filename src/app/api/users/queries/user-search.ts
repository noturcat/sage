import { apiClient } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

export type UserSearchAttributesType = {
	first_name: string
	middle_name: string | null
	last_name: string
	username: string
	email: string
	gender: string
	is_verified: boolean
	is_active: boolean
	slug: string
	bio: string | null
	avatar: {
		id: string
		url: string | null
	} | null
	email_verified_at: string | null
	created_at: string
	updated_at: string
}

export type UserSearchType = {
	id: string
	attributes: UserSearchAttributesType
}

export const searchUsers = async (query: string, limit: number = 20) => {
	try {
		const response = await apiClient.get('/chat/users/search', {
			params: {
				q: query,
				limit: limit,
			},
		})
		const data = (response.data.data || response.data) as UserSearchType[]
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUsersSuggestions = async (limit: number = 10) => {
	try {
		const response = await apiClient.get('/chat/users/suggestions', {
			params: {
				limit: limit,
			},
		})
		const data = (response.data.data || response.data) as UserSearchType[]
		return data
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const useGetUsersSuggestions = (limit: number = 4, options?: { enabled?: boolean }) => {
	return useQuery<UserSearchType[]>({
		queryKey: ['users', 'suggestions', limit],
		queryFn: () => getUsersSuggestions(limit),
		enabled: options?.enabled ?? true,
	})
}

export const useSearchUsers = (query: string, limit: number = 4) => {
	return useQuery<UserSearchType[]>({
		queryKey: ['users', 'search', query, limit],
		queryFn: () => searchUsers(query, limit),
		enabled: query.trim().length > 0,
	})
}
