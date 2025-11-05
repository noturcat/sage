import { z } from 'zod'

export const featuredMediaSchema = z.object({
	featured_media: z.any().refine(value => value instanceof File, {
		message: 'Featured media is required',
	}),
})

export type FeaturedMediaForm = z.infer<typeof featuredMediaSchema>
