import type { ActionItem } from '@/components/molecules/more-actions/MoreActions.type'

export const createPostActions = (postId: string, userName: string): ActionItem[] => [
	{
		id: 'notifications',
		label: 'Turn on notifications for this post',
		icon: '/icons/arrow-slant.svg',
		apiMethod: () => Promise.resolve({ success: true }),
	},
	{
		id: 'hide',
		label: 'Hide Post',
		icon: '/icons/arrow-slant.svg',
		apiMethod: () => Promise.resolve({ success: true }),
	},
	{
		id: 'unfollow',
		label: `Unfollow ${userName}`,
		icon: '/icons/arrow-slant.svg',
		apiMethod: () => Promise.resolve({ success: true }),
	},
	{
		id: 'report',
		label: 'Report Post',
		danger: true,
		icon: '/icons/arrow-slant.svg',
		apiMethod: () => Promise.resolve({ success: true }),
	},
	{
		id: 'block',
		label: `Block ${userName}`,
		danger: true,
		icon: '/icons/arrow-slant.svg',
		apiMethod: () => Promise.resolve({ success: true }),
	},
]
