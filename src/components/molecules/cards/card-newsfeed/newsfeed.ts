export const options = [
	{
		id: 1,
		label: 'Turn on notifications for this post',
		onClick: () => {
			console.log('Turn on notifications for this post')
		},
	},
	{
		id: 2,
		label: 'Hide Post',
		onClick: () => {
			console.log('Hide Post')
		},
	},
	{
		id: 3,
		label: 'Unfollow User',
		onClick: () => {
			console.log('Unfollow User')
		},
	},
	{
		id: 4,
		label: 'Report Post',
		onClick: () => {
			console.log('Report Post')
		},
	},
	{
		id: 5,
		label: 'Block User',
		onClick: () => {
			console.log('Block User')
		},
	},
]

export const icons = [
	{
		id: 1,
		icon: 'iconHeart',
		label: 'Like',
		count: 21,
	},
	{
		id: 2,
		icon: 'iconComment',
		label: 'Comment',
		count: 22,
	},
	{
		id: 3,
		icon: 'iconRepost',
		label: 'Repost',
		count: 33,
	},
]
