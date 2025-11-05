import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getAuthToken, getEchoConfig } from './echo/config'
import {
	ChatRoomListener,
	UserChannelListener,
	createChatRoomListener,
	createUserChannelListener,
} from './echo/listeners'

// Export types and enums
export * from './echo/types'

// Export listeners
export { ChatRoomListener, UserChannelListener, createChatRoomListener, createUserChannelListener }

// Extend Window interface to include Echo and Pusher
declare global {
	interface Window {
		Echo: Echo<'reverb'>
		Pusher: typeof Pusher
	}
}

// Configure Pusher
if (typeof window !== 'undefined') {
	window.Pusher = Pusher
}

// Initialize Echo (only in browser)
let echoInstance: Echo<'reverb'> | null = null

if (typeof window !== 'undefined') {
	echoInstance = new Echo(getEchoConfig())

	// Add connection debugging
	echoInstance.connector.pusher.connection.bind('connected', () => {
		console.log('Echo connected successfully')
	})

	echoInstance.connector.pusher.connection.bind('disconnected', () => {
		console.log('Echo disconnected')
	})

	echoInstance.connector.pusher.connection.bind('error', (error: Error) => {
		console.error('Echo connection error:', error)
	})

	window.Echo = echoInstance
}

// Helper function to update Echo auth headers
export const updateEchoAuth = (): void => {
	if (typeof window === 'undefined' || !window.Echo) return

	const token = getAuthToken()
	if (token && window.Echo.options) {
		window.Echo.options.auth = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	}
}

// Export the Echo instance
export const echo = typeof window !== 'undefined' ? window.Echo : null

// Export default Echo instance
export default echo
