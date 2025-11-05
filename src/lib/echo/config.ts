import { EchoConfig } from './types'

// Environment variables for Reverb configuration
const REVERB_APP_KEY = process.env.NEXT_PUBLIC_REVERB_APP_KEY
const REVERB_HOST = process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost'
const REVERB_PORT = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080')
const REVERB_SCHEME = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http'
const API_URL = process.env.NEXT_PUBLIC_WS_API_URL

// Validate required environment variables
if (!REVERB_APP_KEY) {
	throw new Error('NEXT_PUBLIC_REVERB_APP_KEY is required')
}

if (!API_URL) {
	throw new Error('NEXT_PUBLIC_API_URL is required')
}

// Helper function to get auth token
export const getAuthToken = (): string => {
	if (typeof document === 'undefined') return ''
	return document.cookie.match(/(?:^|; )userToken=([^;]+)/)?.[1] ?? ''
}

// Create Echo configuration
export const getEchoConfig = (): EchoConfig => ({
	broadcaster: 'reverb',
	key: REVERB_APP_KEY,
	wsHost: REVERB_HOST,
	wsPort: REVERB_PORT,
	wssPort: REVERB_PORT,
	forceTLS: REVERB_SCHEME === 'https',
	enabledTransports: ['ws', 'wss'],
	authEndpoint: `${API_URL}/broadcasting/auth`,
	auth: {
		headers: {
			Authorization: `Bearer ${getAuthToken()}`,
		},
	},
})
