import { z } from 'zod'

export const editProfileSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required'),
	bio: z.string().min(1, 'Bio is required'),
	username: z.string().min(1, 'Username is required'),
	address: z.string().min(1, 'Address is required'),
	website: z.string().min(1, 'Website is required'),
	birthday: z.date().transform(date => date.toISOString().split('T')[0]),
	interests: z.array(z.string()).min(1, 'Interests are required'),
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>
