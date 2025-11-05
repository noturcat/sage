import type { NextConfig } from 'next'

const path = require('path')
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
	reactStrictMode: false,
	output: 'standalone',
	sassOptions: {
		includePaths: [path.join(__dirname, 'src', 'styles')],
	},
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
			},
			{
				protocol: 'http',
				hostname: '127.0.0.1',
				port: '8000',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
			},
			{
				protocol: 'https',
				hostname: 'localhost',
				port: '3000',
			},
			{
				protocol: 'http',
				hostname: 'dev.justholistics.com',
			},
			{
				protocol: 'https',
				hostname: 'dev.justholistics.com',
			},
			{
				protocol: 'http',
				hostname: 'dev-api.justholistics.com',
			},
			{
				protocol: 'https',
				hostname: 'dev-api.justholistics.com',
			},
		],
	},
	async headers() {
		const tsHost = process.env.NEXT_PUBLIC_TYPESENSE_HOST
		const tsProtocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'https'
		const tsPort = process.env.NEXT_PUBLIC_TYPESENSE_PORT
		const tsOrigin = tsHost
			? `${tsProtocol}://${tsHost}${tsPort && tsPort !== '443' ? `:${tsPort}` : ''}`
			: ''

		const connectSrcParts = [
			"'self'",
			'http://localhost:8000',
			'http://127.0.0.1:8000',
			'https://dev-api.justholistics.com',
			'https://www.google-analytics.com',
			'https://www.googletagmanager.com',
			'https://servedbyadbutler.com',
			'http://servedbyadbutler.com',
			'https://js.stripe.com',
			'https://api.stripe.com',
			tsOrigin,
		].filter(Boolean)

		const imgSrcParts = [
			"'self'",
			'data:',
			'blob:',
			'https:',
			'http://localhost:8000',
			'http://127.0.0.1:8000',
			'http://localhost:3000',
			'https://servedbyadbutler.com',
		]

		const csp = [
			"default-src 'self'",
			`connect-src ${connectSrcParts.join(' ')}`,
			`img-src ${imgSrcParts.join(' ')}`,
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com",
			"script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com",
			"style-src 'self' 'unsafe-inline'",
			"font-src 'self' data: https:",
			"frame-src 'self' https://www.googletagmanager.com https://js.stripe.com https://servedbyadbutler.com http://servedbyadbutler.com",
			"worker-src 'self' blob:",
			"base-uri 'self'",
			"form-action 'self'",
			"object-src 'none'",
		].join('; ')

		return [
			{
				source: '/:path*',
				headers: [{ key: 'Content-Security-Policy', value: csp }],
			},
		]
	},
	experimental: {
		staleTimes: { dynamic: 30 },
	},
	webpack: (config: any, { dev }: { dev: boolean }) => {
		// Disable filesystem cache in dev to avoid ENOENT rename errors on Windows
		if (dev) {
			config.cache = false
		}
		return config
	},
}

export default withPWA(nextConfig)
