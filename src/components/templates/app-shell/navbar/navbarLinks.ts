export interface NavbarLink {
	label: string
	path: string
}

export const navbarLinks: NavbarLink[] = [
	{
		label: 'Home',
		path: '/',
	},
	{
		label: 'Search',
		path: '',
	},
	{
		label: 'Community',
		path: '/community',
	},
	{
		label: 'Sage AI',
		path: '/sage-ai',
	},
	{
		label: 'Discovery',
		path: '/discover',
	},
	{
		label: 'Threads',
		path: '/threads',
	},
	{
		label: 'Protocols',
		path: '/protocols',
	},
	{
		label: 'Directory',
		path: '/directory',
	},
	{
		label: 'Messages',
		path: '/messages',
	},
	{
		label: 'Saved',
		path: '/saved',
	},
]

export const profileLinks = [
	{
		label: 'Notifications',
		path: '/notifications',
	},
	{
		label: 'Profile',
		path: '/profile',
	},
]
