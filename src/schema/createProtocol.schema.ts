import { z } from 'zod'

// Image data structure for storing uploaded images
export const imageDataSchema = z.object({
	id: z.string(),
	src: z.string(), // base64 data URL or uploaded URL
	alt: z.string().optional(),
	fileName: z.string(),
	size: z.number(),
	type: z.string(),
	uploadedAt: z.date(),
})

export type ImageData = z.infer<typeof imageDataSchema>

// Rich text content structure for backend submission
export const richTextContentSchema = z.object({
	html: z.string(),
	json: z.any(), // TipTap JSON format
	images: z.array(imageDataSchema).optional(),
})

export type RichTextContent = z.infer<typeof richTextContentSchema>

// Update the schema to use JSONContent[] directly
export const createProtocolSchema = z.object({
	category: z.string().min(1, 'Category is required'),
	title: z.string().min(1, 'Protocol name is required').max(90, 'Title too long'),
	tags: z
		.array(z.object({ value: z.string() }))
		.min(1, 'At least one tag is required')
		.max(5, 'Too many tags selected'),
	ingredients: z.array(z.any()).min(1, 'Ingredients cannot be empty'),
	mechanism: z.array(z.any()).min(1, 'Mechanism cannot be empty'),
	timeline: z.array(z.any()).min(1, 'Timeline cannot be empty'),
	instructions: z.array(z.any()).min(1, 'Instructions cannot be empty'),
	disclaimer: z.array(z.any()).optional(),
	faqs: z
		.array(
			z.object({
				question: z.string().min(1, 'Question is required'),
				answer: z.string().min(1, 'Answer is required'),
			})
		)
		.min(1, 'At least one FAQ is required')
		.max(10, 'Too many FAQs'),
	sources: z
		.array(
			z.object({
				link: z.string().min(1, 'Source URL is required'),
			})
		)
		.min(1, 'At least one source is required')
		.max(20, 'Too many sources'),
	featured_media: z.any().optional(),
})

export type CreateProtocolForm = z.infer<typeof createProtocolSchema>
