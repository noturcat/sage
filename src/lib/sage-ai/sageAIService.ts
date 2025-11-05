'use client'

import { getTypesenseClient, isTypesenseConfigured } from '../typesenseClient'
import type { SearchItem, Category } from '@/components/organisms/global-search/GlobalSearch.types'

export type SageAIResponse = {
	answer: string
	sources: SearchItem[]
	searchQuery: string
	questionAnalysis?: {
		type: string
		confidence: number
		keywords: string[]
		context: string[]
	}
}

export type SageAIOptions = {
	maxSources?: number
	searchTimeout?: number
	aiModel?: string
	temperature?: number
}

export class SageAIService {
	private static instance: SageAIService
	private typesenseClient = getTypesenseClient()
	private isTypesenseReady = isTypesenseConfigured()

	private constructor() {}

	static getInstance(): SageAIService {
		if (!SageAIService.instance) {
			SageAIService.instance = new SageAIService()
		}
		return SageAIService.instance
	}

	private async searchRelevantContent(
		query: string,
		options: SageAIOptions = {}
	): Promise<SearchItem[]> {
		if (!this.isTypesenseReady || !this.typesenseClient) {
			return []
		}

		try {
			const searchRequests = [
				{
					collection: 'protocols',
					q: query,
					query_by: 'title,ingredients,mechanism,timeline,instructions',
					highlight_full_fields: 'title,ingredients,mechanism,timeline,instructions',
					per_page: 3,
				},
				{
					collection: 'threads',
					q: query,
					query_by: 'title,description',
					highlight_full_fields: 'title,description',
					per_page: 2,
				},
				{
					collection: 'discoveries',
					q: query,
					query_by: 'title,description',
					highlight_full_fields: 'title,description',
					per_page: 2,
				},
				{
					collection: 'listings',
					q: query,
					query_by: 'name,description',
					highlight_full_fields: 'name,description',
					per_page: 2,
				},
				{
					collection: 'categories',
					q: query,
					query_by: 'name,description',
					highlight_full_fields: 'name,description',
					per_page: 2,
				},
			]

			const multiSearchResult = await this.typesenseClient.multiSearch.perform(
				{ searches: searchRequests },
				{}
			)

			const allResults: SearchItem[] = []

			multiSearchResult.results?.forEach(
				(result: {
					collection_name?: string
					hits?: Array<{
						document: Record<string, unknown>
						highlight?: Record<string, unknown>
						text_match?: number
					}>
					code?: number
					error?: string
				}) => {
					// Skip results with errors (like collection not found)
					if (result.code && result.code !== 200) {
						return
					}

					if (result.hits) {
						result.hits.forEach(
							(hit: {
								document: Record<string, unknown>
								highlight?: Record<string, unknown>
								text_match?: number
							}) => {
								// Extract content based on collection type
								let content = ''
								if (result.collection_name === 'protocols') {
									content = [
										hit.document.ingredients,
										hit.document.mechanism,
										hit.document.timeline,
										hit.document.instructions,
									]
										.filter(Boolean)
										.join(' ')
								} else {
									content = String(hit.document.content || hit.document.description || '')
								}

								allResults.push({
									id: String(hit.document.id || hit.document._id || ''),
									title: String(hit.document.title || hit.document.name || 'Untitled'),
									content: content,
									type: result.collection_name || 'unknown',
									url: String(hit.document.url || hit.document.slug || '#'),
									href: String(hit.document.url || hit.document.slug || '#'),
									category: (result.collection_name as Category) || 'All',
									highlight:
										(hit.highlight as {
											content?: string[]
											title?: string[]
											description?: string[]
											ingredients?: string[]
											mechanism?: string[]
											timeline?: string[]
											instructions?: string[]
										}) || {},
									score: hit.text_match || 0,
								})
							}
						)
					}
				}
			)

			return allResults
				.sort((a, b) => (b.score || 0) - (a.score || 0))
				.slice(0, options.maxSources || 5)
		} catch (error) {
			console.error('Typesense search error:', error)
			return []
		}
	}

	async generateResponse(userQuery: string, options: SageAIOptions = {}): Promise<SageAIResponse> {
		try {
			const sources = await this.searchRelevantContent(userQuery, options)

            // Call server-side API with a relative path (avoids base/origin issues)
            const apiUrl = '/api/sage-ai'

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content: userQuery }],
					searchResults: sources,
					searchQuery: userQuery,
				}),
			})

            if (!response.ok) {
                if (response.status === 404) {
                    // Demo fallback: API route missing – return placeholder content
                    return {
                        answer:
                            'Demo mode: API route /api/sage-ai is not available. Ensure your Next.js dev server is running and the route exists at src/app/api/sage-ai/route.ts.',
                        sources: sources,
                        searchQuery: userQuery,
                        questionAnalysis: { type: 'unknown', confidence: 0.2, keywords: [], context: [] },
                    }
                }
                throw new Error(`API request failed: ${response.status}`)
            }

			const data = await response.json()

			if (data.error) {
				throw new Error(data.message || 'API error')
			}

			return {
				answer: data.answer,
				sources: data.sources || sources,
				searchQuery: data.searchQuery || userQuery,
				questionAnalysis: data.questionAnalysis,
			}
		} catch (error) {
			console.error('Sage AI service error:', error)
			return {
				answer:
					"I'm sorry, I encountered an error while processing your request. Please try again later.",
				sources: [],
				searchQuery: userQuery,
			}
		}
	}

	isConfigured(): boolean {
		return this.isTypesenseReady
	}
}

export const sageAIService = SageAIService.getInstance()
