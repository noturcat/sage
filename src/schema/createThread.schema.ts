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

// Remove the richTextContentSchema entirely and update the main schema
export const createThreadSchema = z.object({
	category: z.string().min(1, 'Category is required'),
	title: z.string().min(1, 'Thread name is required').max(100, 'Name too long'),
	tags: z
		.array(z.object({ value: z.string() }))
		.min(1, 'At least one tag is required')
		.max(5, 'Too many tags selected'),
	content: z.array(z.any()).min(1, 'Content cannot be empty'),
})

export type CreateThreadForm = z.infer<typeof createThreadSchema>
