// src/lib/openaiClient.ts

'use client'

import OpenAI from 'openai'

let cachedClient: OpenAI | null = null

export type OpenAIEnvConfig = {
	apiKey: string | undefined
	organization?: string | undefined
}

function readEnv(): OpenAIEnvConfig {
	return {
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION,
	}
}

export function getOpenAIClient(): OpenAI | null {
	if (typeof window === 'undefined') return null
	if (cachedClient) return cachedClient

	const { apiKey, organization } = readEnv()

	if (!apiKey) {
		return null
	}

	cachedClient = new OpenAI({
		apiKey,
		organization,
		dangerouslyAllowBrowser: true,
	})

	return cachedClient
}

export function isOpenAIConfigured(): boolean {
	const { apiKey } = readEnv()
	return Boolean(apiKey)
}

export type ChatMessage = {
	role: 'system' | 'user' | 'assistant'
	content: string
}

export type ChatCompletionOptions = {
	model?: string
	temperature?: number
	max_tokens?: number
	stream?: boolean
}

export async function createChatCompletion(
	messages: ChatMessage[],
	options: ChatCompletionOptions = {}
): Promise<string | null> {
	const client = getOpenAIClient()
	if (!client) {
		throw new Error('OpenAI client not configured')
	}

	try {
		const completion = await client.chat.completions.create({
			model: options.model || 'gpt-3.5-turbo',
			messages,
			temperature: options.temperature || 0.7,
			max_tokens: options.max_tokens || 1000,
			stream: false,
		})

		if ('choices' in completion) {
			return completion.choices[0]?.message?.content || null
		}

		return null
	} catch (error) {
		console.error('OpenAI API error:', error)
		throw error
	}
}
