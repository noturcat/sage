import type { Demographic } from '@/components/molecules/cards/profile-card/DemographicCard'

export const demographic: Demographic = {
	bio: 'I am a software engineer and I love to code',
	address1: '123 Main St, Anytown, USA',
	address2: '123 Main St, Anytown, USA',
	gender: 'Male',
	website: 'https://www.google.com',
	birthday: 'January 1, 1990',
	interests: [
		{ id: 1, name: 'Software Engineering' },
		{ id: 2, name: 'Coding' },
		{ id: 3, name: 'Reading' },
		{ id: 4, name: 'Traveling' },
	],
}
