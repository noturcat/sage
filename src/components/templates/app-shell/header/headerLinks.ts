export interface HeaderLink {
	id: string
	label: string
	path: string
}

export const communityLinks: HeaderLink[] = [
	{
		id: '1',
		label: 'Newsfeed',
		path: '/community',
	},
	{
		id: '2',
		label: 'Pages',
		path: '/community/pages',
	},
	{
		id: '3',
		label: 'Videos',
		path: '/community/videos',
	},
	{
		id: '4',
		label: 'Groups',
		path: '/community/groups',
	},
	{
		id: '5',
		label: 'Events',
		path: '/community/events',
	},
]
