/**
 * Sage AI Dynamic Prompt Engine
 * Generates specialized prompts based on question type and context
 */

export type QuestionType =
	| 'protocol'
	| 'general_health'
	| 'technical'
	| 'community'
	| 'search'
	| 'comparison'
	| 'how_to'
	| 'what_is'
	| 'why'
	| 'when'
	| 'where'

export interface QuestionAnalysis {
	type: QuestionType
	confidence: number
	keywords: string[]
	context: string[]
	requiresSpecificSources: boolean
}

export interface PromptTemplate {
	systemPrompt: string
	contextInstructions: string
	responseStyle: string
	sourceRequirements: string
}

interface SearchResult {
	content?: string
	title?: string
	type?: string
	highlight?: {
		content?: string[]
		ingredients?: string[]
		mechanism?: string[]
		timeline?: string[]
		instructions?: string[]
		description?: string[]
	}
}

export class SageAIPromptEngine {
	private static questionPatterns: Record<QuestionType, RegExp[]> = {
		protocol: [
			/protocol/i,
			/procedure/i,
			/step.*by.*step/i,
			/how.*to.*(?:create|make|develop|build|design|implement).*protocol/i,
			/how.*to.*protocol/i,
			/how.*protocol/i,
			/protocol.*creation/i,
			/protocol.*development/i,
			/process/i,
			/method/i,
		],
		general_health: [
			/health/i,
			/wellness/i,
			/treatment/i,
			/symptom/i,
			/condition/i,
			/disease/i,
			/cure/i,
			/heal/i,
		],
		technical: [
			/how.*work/i,
			/mechanism/i,
			/function/i,
			/technical/i,
			/implementation/i,
			/code/i,
			/system/i,
		],
		community: [/community/i, /group/i, /member/i, /discussion/i, /thread/i, /forum/i, /share/i],
		search: [/find/i, /search/i, /look.*for/i, /where.*can.*i/i, /locate/i],
		comparison: [/compare/i, /vs/i, /versus/i, /difference/i, /better/i, /best/i, /which.*is/i],
		how_to: [
			/how.*to/i,
			/how.*do/i,
			/how.*can/i,
			/how.*should/i,
			/how.*would/i,
			/steps/i,
			/guide/i,
			/tutorial/i,
			/instructions/i,
			/step.*by.*step/i,
		],
		what_is: [/what.*is/i, /what.*are/i, /define/i, /definition/i, /explain/i, /meaning/i],
		why: [/why/i, /reason/i, /cause/i, /because/i, /purpose/i],
		when: [/when/i, /time/i, /schedule/i, /duration/i, /timing/i],
		where: [/where/i, /location/i, /place/i, /find/i, /locate/i],
	}

	private static promptTemplates: Record<QuestionType, PromptTemplate> = {
		protocol: {
			systemPrompt: `You are Sage AI, a specialized protocol guide for the Just Holistics community. You provide detailed, step-by-step protocol guidance based on community content.`,
			contextInstructions: `Focus on protocols, procedures, and step-by-step processes from the community content.`,
			responseStyle: `Provide clear, actionable steps with specific details. Use numbered lists and be precise about timing, ingredients, and procedures. After each step or paragraph, add a suggested link in the format: "Suggested: [Link Text](URL)" where the link should point to relevant community content like /protocols, /threads, /discover, or /community.`,
			sourceRequirements: `Reference specific protocols, procedures, and community guidelines.`,
		},
		general_health: {
			systemPrompt: `You are Sage AI, a holistic health advisor for the Just Holistics community. You provide health guidance based on community knowledge and protocols.`,
			contextInstructions: `Focus on health-related content, treatments, wellness approaches, and community health experiences.`,
			responseStyle: `Be supportive and informative while emphasizing that this is community guidance, not medical advice. Include disclaimers about consulting healthcare professionals. After each paragraph or section, add a suggested link in the format: "Suggested: [Link Text](URL)" where the link should point to relevant community content like /protocols, /threads, /discover, or /community.`,
			sourceRequirements: `Reference community health experiences, protocols, and wellness approaches.`,
		},
		technical: {
			systemPrompt: `You are Sage AI, a technical expert for the Just Holistics community. You explain technical concepts and implementations clearly.`,
			contextInstructions: `Focus on technical documentation, implementation details, and community technical resources.`,
			responseStyle: `Use clear technical language with examples. Break down complex concepts into understandable parts. After each explanation or paragraph, add a suggested link in the format: "Suggested: [Link Text](URL)" where the link should point to relevant community content like /protocols, /threads, /discover, or /community.`,
			sourceRequirements: `Reference technical documentation, implementation guides, and community technical resources.`,
		},
		community: {
			systemPrompt: `You are Sage AI, a community guide for Just Holistics. You help users navigate and understand community features and discussions.`,
			contextInstructions: `Focus on community features, discussions, groups, and member interactions.`,
			responseStyle: `Be friendly and community-focused. Encourage participation and provide guidance on community engagement.`,
			sourceRequirements: `Reference community discussions, groups, and member experiences.`,
		},
		search: {
			systemPrompt: `You are Sage AI, a search assistant for the Just Holistics community. You help users find specific information and resources.`,
			contextInstructions: `Focus on helping users locate specific information, resources, or content within the community.`,
			responseStyle: `Provide clear directions and specific locations. Be helpful in guiding users to the right resources.`,
			sourceRequirements: `Reference specific locations, resources, and content within the community.`,
		},
		comparison: {
			systemPrompt: `You are Sage AI, a comparison expert for the Just Holistics community. You help users understand differences and make informed choices.`,
			contextInstructions: `Focus on comparing different approaches, methods, or options available in the community.`,
			responseStyle: `Present balanced comparisons with pros and cons. Help users understand trade-offs and make informed decisions.`,
			sourceRequirements: `Reference multiple sources to provide comprehensive comparisons.`,
		},
		how_to: {
			systemPrompt: `You are Sage AI, a practical guide for the Just Holistics community. You provide clear, actionable instructions.`,
			contextInstructions: `Focus on step-by-step instructions, tutorials, and practical guidance from the community.`,
			responseStyle: `Provide clear, numbered steps with specific details. Include tips and common pitfalls. After each step or paragraph, add a suggested link in the format: "Suggested: [Link Text](URL)" where the link should point to relevant community content like /protocols, /threads, /discover, or /community.`,
			sourceRequirements: `Reference specific instructions, tutorials, and community guidance.`,
		},
		what_is: {
			systemPrompt: `You are Sage AI, an educational guide for the Just Holistics community. You explain concepts clearly and comprehensively.`,
			contextInstructions: `Focus on definitions, explanations, and educational content from the community.`,
			responseStyle: `Provide clear definitions with examples. Use analogies when helpful and build understanding progressively. After each definition or paragraph, add a suggested link in the format: "Suggested: [Link Text](URL)" where the link should point to relevant community content like /protocols, /threads, /discover, or /community.`,
			sourceRequirements: `Reference educational content, definitions, and explanatory resources.`,
		},
		why: {
			systemPrompt: `You are Sage AI, an analytical guide for the Just Holistics community. You help users understand reasons and underlying principles.`,
			contextInstructions: `Focus on explanations of reasons, causes, and underlying principles from community content.`,
			responseStyle: `Provide logical explanations with reasoning. Help users understand the "why" behind recommendations.`,
			sourceRequirements: `Reference community explanations, reasoning, and underlying principles.`,
		},
		when: {
			systemPrompt: `You are Sage AI, a timing expert for the Just Holistics community. You help users understand timing and scheduling.`,
			contextInstructions: `Focus on timing, scheduling, and temporal aspects from community content.`,
			responseStyle: `Provide specific timing information with context. Explain why timing matters.`,
			sourceRequirements: `Reference timing guidelines, schedules, and temporal recommendations.`,
		},
		where: {
			systemPrompt: `You are Sage AI, a location guide for the Just Holistics community. You help users find specific places and resources.`,
			contextInstructions: `Focus on locations, places, and spatial information from community content.`,
			responseStyle: `Provide clear location information with directions. Be specific about where to find things.`,
			sourceRequirements: `Reference specific locations, places, and spatial resources.`,
		},
	}

	static async analyzeQuestion(question: string): Promise<QuestionAnalysis> {
		const questionLower = question.toLowerCase()

		// Use OpenAI to classify the question
		const aiClassification = await this.classifyQuestionWithAI(question)

		// Extract context clues for additional information
		const context: string[] = []
		if (questionLower.includes('protocol')) context.push('protocol')
		if (questionLower.includes('health') || questionLower.includes('wellness'))
			context.push('health')
		if (questionLower.includes('community') || questionLower.includes('group'))
			context.push('community')
		if (questionLower.includes('technical') || questionLower.includes('implementation'))
			context.push('technical')

		// Extract keywords from the question
		const keywords = this.extractKeywords(question)

		return {
			type: aiClassification,
			confidence: 0.9, // High confidence since AI is good at classification
			keywords,
			context,
			requiresSpecificSources: ['protocol', 'technical', 'general_health'].includes(
				aiClassification
			),
		}
	}

	// Use OpenAI to classify questions with typo tolerance
	private static async classifyQuestionWithAI(question: string): Promise<QuestionType> {
		try {
			const prompt = `
Classify this question into one of these types based on its intent and content:

- protocol: Questions about procedures, steps, protocols, how to create/implement protocols
- general_health: Health, wellness, treatment, medical, symptoms, conditions
- technical: How things work, technical explanations, mechanisms, implementation details
- community: Community features, discussions, groups, members, forums
- search: Finding information, resources, looking for something specific
- comparison: Comparing options, differences, better/best choices, vs/versus
- how_to: Step-by-step instructions, tutorials, guides, how to do something
- what_is: Definitions, explanations, what something means, concepts
- why: Reasons, causes, principles, why something happens
- when: Timing, scheduling, duration, when to do something
- where: Locations, places, where to find something

Question: "${question}"

Respond with just the type name (e.g., "protocol"):`

			// Import OpenAI client
			const { OpenAI } = await import('openai')
			const openai = new OpenAI({
				apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
			})

			const response = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.1,
				max_tokens: 20,
			})

			const classification = response.choices[0]?.message?.content?.trim().toLowerCase()

			// Validate the classification
			const validTypes: QuestionType[] = [
				'protocol',
				'general_health',
				'technical',
				'community',
				'search',
				'comparison',
				'how_to',
				'what_is',
				'why',
				'when',
				'where',
			]

			if (validTypes.includes(classification as QuestionType)) {
				return classification as QuestionType
			}

			// Fallback to general_health if classification is invalid
			return 'general_health'
		} catch (error) {
			console.error('Error classifying question with AI:', error)
			// Fallback to simple keyword matching if AI fails
			return this.fallbackClassification(question)
		}
	}

	// Fallback classification using simple keyword matching
	private static fallbackClassification(question: string): QuestionType {
		const questionLower = question.toLowerCase()

		if (questionLower.includes('protocol') || questionLower.includes('procedure')) {
			return 'protocol'
		}
		if (questionLower.startsWith('how') || questionLower.includes('how to')) {
			return 'how_to'
		}
		if (questionLower.startsWith('what') || questionLower.includes('what is')) {
			return 'what_is'
		}
		if (questionLower.startsWith('why')) {
			return 'why'
		}
		if (
			questionLower.includes('health') ||
			questionLower.includes('wellness') ||
			questionLower.includes('treatment')
		) {
			return 'general_health'
		}

		return 'general_health'
	}

	// Extract keywords from the question
	private static extractKeywords(question: string): string[] {
		const words = question.toLowerCase().split(/\s+/)
		const stopWords = [
			'the',
			'a',
			'an',
			'and',
			'or',
			'but',
			'in',
			'on',
			'at',
			'to',
			'for',
			'of',
			'with',
			'by',
			'is',
			'are',
			'was',
			'were',
			'be',
			'been',
			'being',
			'have',
			'has',
			'had',
			'do',
			'does',
			'did',
			'will',
			'would',
			'could',
			'should',
		]

		return words.filter(word => word.length > 2 && !stopWords.includes(word)).slice(0, 10) // Limit to 10 keywords
	}

	static async generatePrompt(question: string, searchResults: SearchResult[]): Promise<string> {
		const analysis = await this.analyzeQuestion(question)
		const template = this.promptTemplates[analysis.type]

		// Build context from search results
		const context = searchResults
			.map((source, index) => {
				const highlight = source.highlight
				let highlightedContent = source.content || ''

				if (highlight) {
					highlightedContent =
						highlight.content?.[0] ||
						highlight.ingredients?.[0] ||
						highlight.mechanism?.[0] ||
						highlight.timeline?.[0] ||
						highlight.instructions?.[0] ||
						highlight.description?.[0] ||
						source.content ||
						''
				}

				return `Source ${index + 1} (${source.type}): ${source.title}\n${highlightedContent}`
			})
			.join('\n\n')

		// Generate specialized prompt
		const specializedPrompt = `${template.systemPrompt}

Your role:
- ${template.contextInstructions}
- ${template.responseStyle}
- ${template.sourceRequirements}
- Be conversational and supportive
- Reference specific sources when relevant
- If you can't find relevant information in the community content, politely decline to answer
- Keep responses concise but informative
- Use a friendly, professional tone

Question Analysis:
- Type: ${analysis.type}
- Confidence: ${Math.round(analysis.confidence * 100)}%
- Keywords: ${analysis.keywords.join(', ')}
- Context: ${analysis.context.join(', ')}

Community Context:
${context || 'No specific community content found for this query.'}

Instructions:
- ONLY base your response on the provided community content from Typesense
- If the content is relevant, reference it naturally
- If no relevant content is found, politely say: "I can only answer questions based on our Just Holistics community content. Please ask about our protocols, threads, pages, or groups."
- Do NOT provide general guidance or answers outside the community content
- Add suggested links inline within the same sentence using format: "text. \"Suggested Link Text\""
- Suggested links should point to community pages like /protocols, /threads, /discover, /community, /videos, or /directory
- Focus exclusively on the community data provided`

		return specializedPrompt
	}

	static async getQuestionType(question: string): Promise<QuestionType> {
		const analysis = await this.analyzeQuestion(question)
		return analysis.type
	}

	static getPromptTemplate(questionType: QuestionType): PromptTemplate {
		return this.promptTemplates[questionType]
	}
}
