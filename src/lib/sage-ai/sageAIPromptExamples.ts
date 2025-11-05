/**
 * Sage AI Dynamic Prompt Examples
 * Demonstrates how different question types generate different prompts
 */

import { SageAIPromptEngine } from './sageAIPromptEngine'

// Example questions and their expected prompt types
export const exampleQuestions = [
	{
		question: 'How do I implement the detox protocol?',
		expectedType: 'protocol',
		description: 'Step-by-step protocol guidance',
	},
	{
		question: 'What are the health benefits of intermittent fasting?',
		expectedType: 'general_health',
		description: 'Health and wellness information',
	},
	{
		question: 'How does the lymphatic system work?',
		expectedType: 'technical',
		description: 'Technical explanation of mechanisms',
	},
	{
		question: 'What groups are available in the community?',
		expectedType: 'community',
		description: 'Community features and navigation',
	},
	{
		question: 'Where can I find the meditation protocols?',
		expectedType: 'search',
		description: 'Search and location assistance',
	},
	{
		question: "What's the difference between keto and paleo?",
		expectedType: 'comparison',
		description: 'Comparing different approaches',
	},
	{
		question: 'How to prepare for a fasting session?',
		expectedType: 'how_to',
		description: 'Step-by-step instructions',
	},
	{
		question: 'What is functional medicine?',
		expectedType: 'what_is',
		description: 'Definition and explanation',
	},
	{
		question: 'Why is sleep important for recovery?',
		expectedType: 'why',
		description: 'Understanding reasons and causes',
	},
	{
		question: 'When should I take my supplements?',
		expectedType: 'when',
		description: 'Timing and scheduling guidance',
	},
	{
		question: 'Where is the best place to do breathwork?',
		expectedType: 'where',
		description: 'Location and spatial guidance',
	},
]

// Mock search results for testing
export const mockSearchResults = [
	{
		id: '1',
		title: 'Detox Protocol Guide',
		type: 'protocol',
		content: 'Step 1: Prepare your body...',
		highlight: {
			instructions: ['Begin with a 12-hour fast', 'Drink plenty of water'],
		},
	},
	{
		id: '2',
		title: 'Community Guidelines',
		type: 'community',
		content: 'Our community values...',
		highlight: {
			description: ['Respectful communication', 'Evidence-based discussions'],
		},
	},
]

// Function to demonstrate prompt generation
export function demonstratePromptGeneration() {
	// This function is kept for potential future use but logging is removed for production
}

// Function to show prompt template differences
export function showPromptTemplateDifferences() {
	// This function is kept for potential future use but logging is removed for production
}

// Export for use in development/testing
export { SageAIPromptEngine }
