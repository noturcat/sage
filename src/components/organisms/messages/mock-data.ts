export interface MessageData {
	message: string
	date: string
	time: string
	avatar: string
	name: string
	username: string
	isActive: boolean
	chatRoomId: string
	isMuted: boolean
}

export interface SuggestionData {
	avatar: string
	fullName: string
	username: string
}

// All messages data - comprehensive list for testing
export const mockAllMessagesData: MessageData[] = [
	{
		message:
			'Hey! Just wanted to check in on the holistic wellness program we discussed. How are things progressing?',
		date: '09/19/2025',
		time: '2:30 PM',
		avatar: '/images/1.jpg',
		name: 'Dr. Sarah Mitchell',
		username: 'dr_sarah',
		isActive: true,
		chatRoomId: '42411ab6925beba881cb507fe094ad7c',
		isMuted: false,
	},
	{
		message:
			'The functional medicine approach you suggested is working wonders for my patients. Thank you!',
		date: '10/28/2025',
		time: '1:45 PM',
		avatar: '/images/2.jpg',
		name: 'Dr. James Chen',
		username: 'james_chen',
		isActive: true,
		chatRoomId: '5326b6925beba881cb501fe094ad7d',
		isMuted: false,
	},
	{
		message:
			'Can we schedule a consultation for next Tuesday? I have some questions about the detox protocol.',
		date: '10/27/2025',
		time: '4:20 PM',
		avatar: '/images/3.jpg',
		name: 'Maria Rodriguez',
		username: 'maria_r',
		isActive: false,
		chatRoomId: '7f8e9d2c4b1a6e5f3c8d9a2b4e6f1c3d',
		isMuted: true,
	},
	{
		message:
			'The herbal medicine recommendations have been incredibly helpful. My energy levels are much better now!',
		date: '10/27/2025',
		time: '3:15 PM',
		avatar: '/images/4.jpg',
		name: 'Alex Thompson',
		username: 'alex_t',
		isActive: false,
		chatRoomId: '9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
		isMuted: false,
	},
	{
		message:
			"I'm interested in learning more about your naturopathic approach. Do you have any resources you could share?",
		date: '09/21/2025',
		time: '11:30 AM',
		avatar: '/images/5.jpg',
		name: 'Dr. Lisa Wang',
		username: 'dr_lisa',
		isActive: false,
		chatRoomId: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
		isMuted: false,
	},
	{
		message:
			'The infrared sauna sessions you recommended have been amazing for my recovery. Thank you so much!',
		date: '09/21/2025',
		time: '9:45 AM',
		avatar: '/images/6.jpg',
		name: 'Robert Kim',
		username: 'robert_k',
		isActive: false,
		chatRoomId: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
		isMuted: true,
	},
	{
		message:
			'Quick question about the cold plunge therapy - what temperature do you recommend for beginners?',
		date: '09/20/2025',
		time: '6:30 PM',
		avatar: '/images/1.jpg',
		name: 'Jennifer Davis',
		username: 'jen_davis',
		isActive: true,
		chatRoomId: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
		isMuted: true,
	},
	{
		message:
			"I've been following your Qi Gong exercises and they've really helped with my stress levels.",
		date: '09/20/2025',
		time: '2:15 PM',
		avatar: '/images/2.jpg',
		name: 'Michael Brown',
		username: 'mike_brown',
		isActive: false,
		chatRoomId: 'a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
		isMuted: true,
	},
	{
		message:
			'The holistic nutrition plan you created for me is working perfectly. I feel so much more balanced now.',
		date: '09/19/2025',
		time: '5:45 PM',
		avatar: '/images/3.jpg',
		name: 'Dr. Amanda Foster',
		username: 'dr_amanda',
		isActive: false,
		chatRoomId: 'c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
		isMuted: true,
	},
	{
		message: 'Could you recommend some natural supplements for immune support during this season?',
		date: '09/19/2025',
		time: '3:20 PM',
		avatar: '/images/4.jpg',
		name: 'Carlos Mendez',
		username: 'carlos_m',
		isActive: false,
		chatRoomId: 'e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
		isMuted: false,
	},
	{
		message:
			'The meditation techniques you taught me have been life-changing. Thank you for your guidance!',
		date: '09/18/2025',
		time: '7:10 PM',
		avatar: '/images/5.jpg',
		name: 'Rachel Green',
		username: 'rachel_g',
		isActive: false,
		chatRoomId: '04f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
		isMuted: false,
	},
	{
		message:
			"I'm interested in your upcoming workshop on integrative medicine. When is the next session?",
		date: '09/18/2025',
		time: '1:30 PM',
		avatar: '/images/6.jpg',
		name: 'Dr. Kevin Patel',
		username: 'dr_kevin',
		isActive: true,
		chatRoomId: '26a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
		isMuted: false,
	},
	{
		message:
			"The acupuncture treatment you recommended has really helped with my chronic pain. I'm so grateful!",
		date: '09/17/2025',
		time: '4:55 PM',
		avatar: '/images/1.jpg',
		name: 'Susan Lee',
		username: 'susan_l',
		isActive: false,
		chatRoomId: '48b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
		isMuted: true,
	},
	{
		message:
			'Do you have any tips for maintaining work-life balance while following a holistic lifestyle?',
		date: '09/17/2025',
		time: '10:15 AM',
		avatar: '/images/2.jpg',
		name: 'Mark Wilson',
		username: 'mark_w',
		isActive: false,
		chatRoomId: '6ad1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
		isMuted: false,
	},
	{
		message:
			'The breathwork exercises you showed me have been incredible for managing my anxiety. Thank you!',
		date: '09/16/2025',
		time: '6:40 PM',
		avatar: '/images/3.jpg',
		name: 'Dr. Emma Taylor',
		username: 'dr_emma',
		isActive: false,
		chatRoomId: '8cf3a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
		isMuted: true,
	},
	{
		message:
			"I'd love to learn more about your approach to treating mold toxicity. Can we schedule a call?",
		date: '09/16/2025',
		time: '2:25 PM',
		avatar: '/images/4.jpg',
		name: 'David Martinez',
		username: 'david_m',
		isActive: true,
		chatRoomId: 'ae15a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
		isMuted: true,
	},
	{
		message:
			'The functional medicine testing you recommended revealed some important insights about my health.',
		date: '09/15/2025',
		time: '8:30 AM',
		avatar: '/images/5.jpg',
		name: 'Dr. Nicole Adams',
		username: 'dr_nicole',
		isActive: false,
		chatRoomId: 'd037b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
		isMuted: true,
	},
	{
		message:
			"Your holistic approach to healthcare is exactly what I've been looking for. Thank you for everything!",
		date: '09/15/2025',
		time: '5:15 PM',
		avatar: '/images/6.jpg',
		name: 'Thomas Anderson',
		username: 'thomas_a',
		isActive: false,
		chatRoomId: 'f259c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
		isMuted: true,
	},
	{
		message:
			'The natural detox protocol you created has been amazing. I feel so much more energized!',
		date: '09/14/2025',
		time: '3:50 PM',
		avatar: '/images/1.jpg',
		name: 'Dr. Rebecca Clark',
		username: 'dr_rebecca',
		isActive: false,
		chatRoomId: '147be2f3a4b5c6d7e8f9a0b1c2d3e4f5',
		isMuted: true,
	},
	{
		message:
			"I'm curious about your thoughts on the latest research in integrative medicine. Any insights?",
		date: '09/14/2025',
		time: '11:20 AM',
		avatar: '/images/2.jpg',
		name: 'Dr. Brian Johnson',
		username: 'dr_brian',
		isActive: true,
		chatRoomId: '369da4b5c6d7e8f9a0b1c2d3e4f5a6b7',
		isMuted: true,
	},
	{
		message:
			"The mindfulness practices you recommended have transformed my daily routine. I'm so grateful!",
		date: '09/13/2025',
		time: '7:45 PM',
		avatar: '/images/3.jpg',
		name: 'Jessica White',
		username: 'jessica_w',
		isActive: false,
		chatRoomId: '58bfa6b7c8d9e0f1a2b3c4d5e6f7a8b9',
		isMuted: true,
	},
]

// Unread messages data - smaller subset for testing unread filter
export const mockUnreadMessagesData: MessageData[] = [
	{
		message:
			'Hey! Just wanted to check in on the holistic wellness program we discussed. How are things progressing?',
		date: '10/28/2025',
		time: '2:30 PM',
		avatar: '/images/1.jpg',
		name: 'Dr. Sarah Mitchell',
		username: 'dr_sarah',
		isActive: true,
		chatRoomId: '7ae1b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
		isMuted: true,
	},
	{
		message:
			'The functional medicine approach you suggested is working wonders for my patients. Thank you!',
		date: '10/28/2025',
		time: '1:45 PM',
		avatar: '/images/2.jpg',
		name: 'Dr. James Chen',
		username: 'james_chen',
		isActive: true,
		chatRoomId: '9c03c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
		isMuted: true,
	},
	{
		message:
			'Quick question about the cold plunge therapy - what temperature do you recommend for beginners?',
		date: '09/20/2025',
		time: '6:30 PM',
		avatar: '/images/1.jpg',
		name: 'Jennifer Davis',
		username: 'jen_davis',
		isActive: true,
		chatRoomId: 'be25e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
		isMuted: true,
	},
	{
		message:
			"I'm interested in your upcoming workshop on integrative medicine. When is the next session?",
		date: '09/18/2025',
		time: '1:30 PM',
		avatar: '/images/6.jpg',
		name: 'Dr. Kevin Patel',
		username: 'dr_kevin',
		isActive: true,
		chatRoomId: 'd047a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
		isMuted: false,
	},
	{
		message:
			"I'd love to learn more about your approach to treating mold toxicity. Can we schedule a call?",
		date: '09/16/2025',
		time: '2:25 PM',
		avatar: '/images/4.jpg',
		name: 'David Martinez',
		username: 'david_m',
		isActive: true,
		chatRoomId: 'f269a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
		isMuted: false,
	},
]

export const mockRequestData: MessageData[] = [
	{
		message:
			'Hey! Just wanted to check in on the holistic wellness program we discussed. How are things progressing?',
		date: '10/28/2025',
		time: '2:30 PM',
		avatar: '/images/1.jpg',
		name: 'Dr. Sarah Mitchell',
		username: 'dr_sarah',
		isActive: true,
		chatRoomId: '42411ab6925beba881cb507fe094ad7c',
		isMuted: false,
	},
]

export const suggestionListData: SuggestionData[] = [
	{
		avatar: '/images/1.jpg',
		fullName: 'Dr. Sarah Mitchell',
		username: 'dr_sarah',
	},
	{
		avatar: '/images/2.jpg',
		fullName: 'Dr. James Chen',
		username: 'james_chen',
	},
	{
		avatar: '/images/3.jpg',
		fullName: 'Maria Rodriguez',
		username: 'maria_r',
	},
	{
		avatar: '/images/4.jpg',
		fullName: 'Alex Thompson',
		username: 'alex_t',
	},
]

// Legacy export for backward compatibility
export const mockMessageListData = mockAllMessagesData
