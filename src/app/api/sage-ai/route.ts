import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SageAIPromptEngine } from '@/lib/sage-ai/sageAIPromptEngine'

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
	try {
		const { searchResults, searchQuery } = await request.json()

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
