import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SageAIPromptEngine } from '@/lib/sage-ai/sageAIPromptEngine'
import type { SearchItem } from '@/components/organisms/global-search/GlobalSearch.types'

// Support both server-safe and public env names; prefer server one
const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
const openai = OPENAI_KEY ? new OpenAI({ apiKey: OPENAI_KEY }) : null

export async function POST(request: NextRequest) {
	try {
		const { searchResults, searchQuery } = await request.json()

		// If no OpenAI key, return a stubbed response so the page works in demo mode
		if (!openai) {
			const topSources: SearchItem[] = Array.isArray(searchResults)
				? (searchResults as SearchItem[]).slice(0, 5)
				: []
			return NextResponse.json({
				answer:
					'Demo mode: OpenAI key not configured. I cannot generate a real AI answer, but I can still show query flow. Try setting OPENAI_API_KEY to enable full answers.',
				sources: topSources,
				searchQuery,
				questionAnalysis: { type: 'unknown', confidence: 0.2, keywords: [], context: [] },
			})
		}

		// Generate dynamic prompt based on question type
		const systemPrompt = await SageAIPromptEngine.generatePrompt(searchQuery, searchResults)

		const openaiMessages = [
			{ role: 'system' as const, content: systemPrompt },
			{ role: 'user' as const, content: searchQuery },
		]

		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: openaiMessages,
			temperature: 0.7,
			max_tokens: 800,
		})

		const answer =
			completion.choices[0]?.message?.content ||
			'I apologize, but I could not generate a response at this time.'

		// Analyze the question for additional context
		const questionAnalysis = await SageAIPromptEngine.analyzeQuestion(searchQuery)

		return NextResponse.json({
			answer,
			sources: searchResults,
			searchQuery,
			questionAnalysis: {
				type: questionAnalysis.type,
				confidence: questionAnalysis.confidence,
				keywords: questionAnalysis.keywords,
				context: questionAnalysis.context,
			},
		})
	} catch (error) {
		console.error('Sage AI API error:', error)
		return NextResponse.json(
			{
				error: 'Failed to generate AI response',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
