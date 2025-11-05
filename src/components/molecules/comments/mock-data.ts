export interface Reply {
	id: number
	avatar: string
	author: string
	time: string
	count: number
	votes: number
	content: string
	nestedReplies: Reply[]
}

export interface Comment {
	id: number
	avatar: string
	author: string
	time: string
	count: number
	votes: number
	content: string
	replies: Reply[]
}

export const nestedReplyReplies: Reply[] = [
	{
		id: 1,
		avatar: '/images/1.jpg',
		author: 'John Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content: 'This is a reply',
		nestedReplies: [],
	},
]

export const nestedReplies: Reply[] = [
	{
		id: 1,
		avatar: '/images/1.jpg',
		author: 'John Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content:
			'This is a reply This is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a reply',
		nestedReplies: nestedReplyReplies,
	},
]

export const replies: Reply[] = [
	{
		id: 1,
		avatar: '/images/1.jpg',
		author: 'John Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content: 'This is a reply',
		nestedReplies: nestedReplies,
	},
	{
		id: 2,
		avatar: '/images/2.jpg',
		author: 'Jane Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content: 'This is a reply',
		nestedReplies: [],
	},
]

export const mockComments: Comment[] = [
	{
		id: 1,
		avatar: '/images/1.jpg',
		author: 'John Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content:
			'This is a commentThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a replyThis is a reply',
		replies: replies,
	},
	{
		id: 2,
		avatar: '/images/2.jpg',
		author: 'Jane Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content: 'This is a comment',
		replies: replies,
	},
	{
		id: 3,
		avatar: '/images/3.jpg',
		author: 'John Doe',
		time: '2 minutes ago',
		count: 1,
		votes: 10,
		content: 'This is a comment',
		replies: replies,
	},
]
