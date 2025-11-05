export interface User {
	name: string
	username: string
	privacy: 'public' | 'private'
	joined: string
	followers: number
	following: number
	profile: string
	cover: string
}

export const user: User = {
	name: 'John Doe',
	username: '@johndoe',
	privacy: 'public',
	joined: 'November 2024',
	followers: 30,
	following: 100,
	profile: '/images/1.jpg',
	cover: '/images/cover-photo.png',
}
