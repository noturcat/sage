interface Message {
	id: string
	variant: 'left' | 'right'
	content: string
	avatar?: string
	timestamp?: string
}

export const requestMessages: Message[] = [
	{
		id: '1',
		variant: 'left',
		content: 'Hey! Just wanted to check in on the holistic wellness program we discussed.',
		avatar: '/images/1.jpg',
		timestamp: '10:30 AM',
	},
	{
		id: '2',
		variant: 'left',
		content: 'How are things progressing?',
		avatar: '/images/1.jpg',
		timestamp: '10:31 AM',
	},
]

// Example messages with consecutive grouping and timestamps
export const mockMessages: Message[] = [
	{
		id: '1',
		variant: 'left',
		content: 'Hey, how are you doing?',
		avatar: '/images/1.jpg',
		timestamp: '10:30 AM',
	},
	{
		id: '2',
		variant: 'left',
		content: 'I wanted to ask about the project',
		avatar: '/images/1.jpg',
		timestamp: '10:31 AM',
	},
	{
		id: '3',
		variant: 'left',
		content: 'Can we discuss it now?',
		avatar: '/images/1.jpg',
		timestamp: '10:32 AM',
	},
	{ id: '4', variant: 'right', content: "I'm doing great, thanks!", timestamp: '10:35 AM' },
	{ id: '5', variant: 'right', content: 'What about the project?', timestamp: '10:36 AM' },
	{ id: '6', variant: 'right', content: "I'm ready to discuss it", timestamp: '10:37 AM' },
	{
		id: '7',
		variant: 'left',
		content: "Perfect! Let's talk about it",
		avatar: '/images/1.jpg',
		timestamp: '10:40 AM',
	},
	{
		id: '8',
		variant: 'left',
		content: 'I have some ideas',
		avatar: '/images/1.jpg',
		timestamp: '10:41 AM',
	},
	{ id: '9', variant: 'right', content: 'That sounds great!', timestamp: '10:45 AM' },
	{
		id: '10',
		variant: 'left',
		content: 'Let me know when you are free',
		avatar: '/images/1.jpg',
		timestamp: '10:46 AM',
	},
	{
		id: '11',
		variant: 'left',
		content: 'Hey, how are you doing?',
		avatar: '/images/1.jpg',
		timestamp: '11:30 AM',
	},
	{
		id: '12',
		variant: 'left',
		content: 'I wanted to ask about the project',
		avatar: '/images/1.jpg',
		timestamp: '11:31 AM',
	},
	{
		id: '13',
		variant: 'left',
		content: 'Can we discuss it now?',
		avatar: '/images/1.jpg',
		timestamp: '11:32 AM',
	},
	{ id: '14', variant: 'right', content: "I'm doing great, thanks!", timestamp: '11:35 AM' },
	{ id: '15', variant: 'right', content: 'What about the project?', timestamp: '11:36 AM' },
	{ id: '16', variant: 'right', content: "I'm ready to discuss it", timestamp: '11:37 AM' },
	{
		id: '17',
		variant: 'left',
		content: "Perfect! Let's talk about it",
		avatar: '/images/1.jpg',
		timestamp: '11:40 AM',
	},
	{
		id: '18',
		variant: 'left',
		content: 'I have some ideas',
		avatar: '/images/1.jpg',
		timestamp: '11:41 AM',
	},
	{ id: '19', variant: 'right', content: 'That sounds great!', timestamp: '11:45 AM' },
	{
		id: '20',
		variant: 'left',
		content: 'Let me know when you are free',
		avatar: '/images/1.jpg',
		timestamp: '11:46 AM',
	},
]
