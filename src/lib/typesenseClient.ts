'use client'

import Typesense, { Client } from 'typesense'

let cachedClient: Client | null = null

export type TypesenseEnvConfig = {
	host: string | undefined
	port: string | undefined
	protocol: string | undefined
	searchKey: string | undefined
	timeoutSeconds?: number
}

function readEnv(): TypesenseEnvConfig {
	return {
		host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		port: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		searchKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY,
		timeoutSeconds: Number(process.env.NEXT_PUBLIC_TYPESENSE_TIMEOUT_SECONDS || 10),
	}
}

export function getTypesenseClient(): Client | null {
	if (typeof window === 'undefined') return null
	if (cachedClient) return cachedClient

	const { host, port, protocol, searchKey, timeoutSeconds } = readEnv()

	if (!host || !port || !protocol || !searchKey) {
		// Silently return null if not configured; caller can handle gracefully
		return null
	}

	cachedClient = new Typesense.Client({
		nodes: [
			{
				host,
				port: Number(port),
				protocol: protocol as 'http' | 'https',
			},
		],
		apiKey: searchKey,
		connectionTimeoutSeconds: timeoutSeconds,
	})

	return cachedClient
}

export function isTypesenseConfigured(): boolean {
	const { host, port, protocol, searchKey } = readEnv()
	return Boolean(host && port && protocol && searchKey)
}
