import axios, { AxiosRequestHeaders } from 'axios'

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	timeout: 10000,
})

apiClient.interceptors.request.use(config => {
	if (!config.headers) config.headers = {} as AxiosRequestHeaders
	const token =
		typeof document !== 'undefined'
			? (document.cookie.match(/(?:^|; )userToken=([^;]+)/)?.[1] ?? '')
			: ''
	if (token) {
		config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`
	}
	const csrf =
		typeof document !== 'undefined'
			? (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] ?? '')
			: ''
	if (csrf) {
		config.headers['X-CSRF-Token'] = decodeURIComponent(csrf)
	}
	return config
})

apiClient.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Optionally trigger logout flow
		}

		// Handle request cancellation gracefully
		if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
			console.log('Request was cancelled:', error.config?.url)
			// Don't treat cancellation as an error
			return Promise.reject({ ...error, isCancelled: true })
		}

		return Promise.reject(error)
	}
)
