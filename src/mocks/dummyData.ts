// Centralized dummy data generators for consistent placeholder content
import type { NotificationItem } from '@/components/molecules/notifications/Notifications'

const avatarImages = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg'] as const

export function getAvatarImage(index: number = 0): string {
	const safeIndex = Math.abs(index) % avatarImages.length
	return avatarImages[safeIndex]
}

export function getDefaultAvatar(): string {
	return getAvatarImage(0)
}

// Deterministic PRNG (Mulberry32) to avoid SSR/CSR hydration mismatches
function mulberry32(seed: number): () => number {
	let t = seed >>> 0
	return function () {
		t += 0x6d2b79f5
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

const seededRand = mulberry32(123456789)

function randomInt(min: number, max: number): number {
	return Math.floor(seededRand() * (max - min + 1)) + min
}

function randomElement<T>(arr: readonly T[]): T {
	return arr[randomInt(0, arr.length - 1)]
}

function generateRelativeTime(): string {
	const options = ['just now', '2m', '5m', '12m', '24m', '45m', '1h', '2h', '6h', '1d', '2d']
	return randomElement(options)
}

const notificationNames = [
	'Neomi Gutierrez',
	'Jessica Stillman',
	'Iris',
	'Eric Turner',
	'Alex Kim',
	'Sasha Lee',
	'Jordan Smith',
	'Priya Singh',
]

const notificationActions = [
	'liked your post.',
	'commented on your post.',
	'shared your post.',
	'mentioned you in a comment.',
	'started following you.',
	'invited you to an event.',
	'replied to your comment.',
	'reacted ❤️ to your post.',
]

export function generateRandomNotifications(count: number = 10): NotificationItem[] {
	return Array.from({ length: count }, (_, i) => {
		const name = randomElement(notificationNames)
		const description = randomElement(notificationActions)
		const time = generateRelativeTime()
		const unread = seededRand() < 0.5
		const avatarIdx = randomInt(0, avatarImages.length - 1)
		return {
			id: `n-${i + 1}`,
			title: name,
			description,
			time,
			unread,
			avatarSrc: getAvatarImage(avatarIdx),
		}
	})
}

export function generateContacts(count: number = 5): { avatar: string; name: string }[] {
	const names = ['John Doe', 'Jane Doe']
	return Array.from({ length: count }, (_, i) => ({
		avatar: getAvatarImage(i),
		name: names[i % names.length],
	}))
}

export function generateWhoToFollow(
	count: number = 3
): { avatar: string; name: string; description: string; label: string }[] {
	const names = ['John Doe', 'Jane Doe']
	const description = 'Exploring the emotional and psychological dimensions of...'
	return Array.from({ length: count }, (_, i) => ({
		avatar: getAvatarImage(i),
		name: names[i % names.length],
		description,
		label: 'Follow',
	}))
}

export function generateShortcuts(count: number = 5): { label: string; icon: string }[] {
	const labels = [
		'HOLISTIC FAMILY',
		'Main Holistic Lifestyle',
		'BUY and SELL Holistic',
		'Texas Community Holistic',
	]

	return Array.from({ length: count }, (_, i) => ({
		label: labels[i % labels.length],
		icon: getAvatarImage(i),
	}))
}

export function getDefaultPostData(): {
	image_url: string
	members: string
	group_name: string
	dateTime?: string
	location?: string
	response?: string
} {
	return {
		image_url: '/images/newsfeed-image.jpg',
		members: '3,606 MEMBERS',
		group_name: 'Herbalism: The Holistic Approach for Health Improvement',
		dateTime: '2025-08-25',
		location: 'New York, NY',
		response: 'I will be there',
	}
}

export const events = [
	{ title: 'All Events', count: 0, active: false },
	{ title: 'Featured Events', count: 10, active: false },
	{ title: 'My Created Events', count: 100, active: false },
	{ title: 'Nearby Events', count: 10, active: false },
	{ title: 'Unpublished Events', count: 0, active: false },
]

export const categories = [
	{ title: 'General', count: 0, active: false },
	{ title: 'Yoga', count: 10, active: false },
	{ title: 'Regenerative Farming', count: 100, active: false },
	{ title: 'Parenting', count: 100, active: false },
	{ title: 'Float Therapy', count: 100, active: false },
	{ title: 'Animal Care', count: 100, active: false },
]

export const filterByDate = [
	{ title: 'Today', count: 10, active: false },
	{ title: 'Tomorrow', count: 100, active: false },
	{ title: 'Upcoming Events (1 Week)', count: 100, active: false },
	{ title: 'Upcoming Events (2 Weeks)', count: 100, active: false },
	{ title: 'By Month', count: 100, active: false },
	{ title: 'By Year', count: 100, active: false },
	{ title: 'Past Events', count: 100, active: false },
]

export const eventCategories = [
	{ title: 'General', count: 0, active: false },
	{ title: 'Meeting', count: 10, active: false },
]

export const pages = [
	{ title: 'All Pages', count: 0, active: false },
	{ title: 'Featured Pages', count: 10, active: false },
	{ title: 'My Created Pages', count: 100, active: false },
]

export type NavItem = {
	icon: string
	label: string
	activeIcon?: string
	size: number
	href?: string
}

export const leftNavItems: NavItem[] = [
	{
		icon: '/icons/newsfeed.svg',
		activeIcon: '/icons/active-newsfeed.svg',
		label: 'Newsfeed',
		href: '/community',
		size: 21,
	},
	{
		icon: '/icons/pages.svg',
		activeIcon: '/icons/active-pages.svg',
		label: 'Pages',
		href: '/community/pages',
		size: 21,
	},

	{
		icon: '/icons/videos.svg',
		activeIcon: '/icons/active-videos.svg',
		label: 'Videos',
		href: '/community/videos',
		size: 21,
	},
	{
		icon: '/icons/groups.svg',
		activeIcon: '/icons/active-groups.svg',
		label: 'Groups',
		href: '/community/groups',
		size: 21,
	},
	{
		icon: '/icons/events.svg',
		activeIcon: '/icons/active-events.svg',
		label: 'Events',
		href: '/community/events',
		size: 21,
	},
]

export const defaultNotificationItems: NotificationItem[] = generateRandomNotifications(50)

export const mockPageCards = [
	{
		id: 1,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/1.jpg',
		members: '3,606 MEMBERS',
		page_name: 'Herbalism: The Holistic Approach for Health Improvement',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 2,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/2.jpg',
		members: '2,210 MEMBERS',
		page_name: 'Yoga and Breathwork Circle',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 3,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/3.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 4,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/4.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 5,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/5.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 6,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/6.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 7,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/7.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 8,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/8.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
	{
		id: 9,
		image_url: '/images/newsfeed-image.jpg',
		avatar_url: '/images/9.jpg',
		members: '12,431 MEMBERS',
		page_name: 'Regenerative Farming Collective',
		service: 'Health',
		likes_count: 100,
		ctaVariant: 'primary' as const,
	},
]

export const mockGroupCards = [
	{
		id: 1,
		image_url: '/images/newsfeed-image.jpg',
		members: '3,606 MEMBERS',
		group_name: 'Herbalism: The Holistic Approach for Health Improvement',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 2,
		image_url: '/images/newsfeed-image.jpg',
		members: '2,210 MEMBERS',
		group_name: 'Yoga and Breathwork Circle',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 3,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 4,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 5,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 6,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 7,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 8,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 9,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
	{
		id: 10,
		image_url: '/images/newsfeed-image.jpg',
		members: '12,431 MEMBERS',
		group_name: 'Regenerative Farming Collective',
		ctaLabel: 'Join Group',
		ctaVariant: 'primary' as const,
	},
]

export const mockEventCards: {
	image_url: string
	group_name: string
	dateTime: string
	location: string
	interestedCount: number
	goingCount: number
	ctaLabel: string
	ctaVariant: 'primary' | 'secondary' | 'outlined'
}[] = [
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Herbalism: The Holistic Approach for Health Improvement',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'Aberdeen Court Hotel',
		interestedCount: 116,
		goingCount: 32,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Yoga and Breathwork Circle',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
	{
		image_url: '/images/newsfeed-image.jpg',
		group_name: 'Regenerative Farming Collective',
		dateTime: 'Sat, Feb 22 at 1 PM',
		location: 'New York, NY',
		interestedCount: 100,
		goingCount: 50,
		ctaLabel: 'Join Event',
		ctaVariant: 'primary',
	},
]

export const videos = [
	{ title: 'All Videos', count: 0, active: false },
	{ title: 'Featured Videos', count: 10, active: false },
	{ title: 'My Created Videos', count: 100, active: false },
]

export const mockVideoCards = [
	{
		videoSrc:
			'/videos/y2mate--Transforming-Healthcare-Dr-Khan-s-Functional-Medicine-Approach-to-Achieving-Optimal_360.mp4',
		title:
			"Transforming Healthcare: Dr. Khan's Functional Medicine Approach to Achieving Optimal Health",
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc:
			'/videos/y2mate--Redefining-Healthcare-The-Holistic-Approach-of-Functional-Medicine-Beyond_360p.mp4',
		title: 'Redefining Healthcare: The Holistic Approach of Functional Medicine Beyond',
		author: {
			avatar: '/images/2.jpg',
			name: 'Jane Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc:
			'/videos/y2mate--Beat-Mold-Toxicity-with-Functional-Medicine-Detox-Diet-Testing_360p.mp4',
		title: 'Beat Mold Toxicity with Functional Medicine Detox Diet Testing',
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc: '/videos/y2mate--Doctor-Explains-The-War-On-Natural-Medicine-How-it_360.mp4',
		title: 'Doctor Explains The War On Natural Medicine How it Works',
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc:
			'/videos/y2mate--Dr-Kate-Henry-Naturopathic-and-Holistic-Functional-Medicine_360p.mp4',
		title: 'Dr. Kate Henry Naturopathic and Holistic Functional Medicine',
		author: {
			avatar: '/images/3.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc: '/videos/y2mate--Holistic-Integrative-and-Functional-Nutrition-Compared_360p.mp4',
		title: 'Holistic Integrative and Functional Nutrition Compared',
		author: {
			avatar: '/images/2.jpg',
			name: 'John Doe',
		},
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc: '/videos/y2mate--Is-A-Naturopathic-Doctor-The-Same-As-A-Holistic-Doctor_360p.mp4',
		title: 'Is A Naturopathic Doctor The Same As A Holistic Doctor',
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'Naturopathic Medicine vs Functional Medicine',
		views: 100,
		likes: 100,
		comments: 100,
	},
]
export const TrendingVideos = [
	{
		videoSrc:
			'/videos/y2mate--Transforming-Healthcare-Dr-Khan-s-Functional-Medicine-Approach-to-Achieving-Optimal_360.mp4',
		title:
			"Transforming Healthcare: Dr. Khan's Functional Medicine Approach to Achieving Optimal Health",
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc:
			'/videos/y2mate--Redefining-Healthcare-The-Holistic-Approach-of-Functional-Medicine-Beyond_360p.mp4',
		title: 'Redefining Healthcare: The Holistic Approach of Functional Medicine Beyond',
		author: {
			avatar: '/images/2.jpg',
			name: 'Jane Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc:
			'/videos/y2mate--Beat-Mold-Toxicity-with-Functional-Medicine-Detox-Diet-Testing_360p.mp4',
		title: 'Beat Mold Toxicity with Functional Medicine Detox Diet Testing',
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
	{
		videoSrc: '/videos/y2mate--Doctor-Explains-The-War-On-Natural-Medicine-How-it_360.mp4',
		title: 'Doctor Explains The War On Natural Medicine How it Works',
		author: {
			avatar: '/images/1.jpg',
			name: 'John Doe',
		},
		description: 'This is a description of the video',
		views: 100,
		likes: 100,
		comments: 100,
	},
]
export const advertisement = [
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=7");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'><\/scr"+"ipt>");
//]]>--></script><noscript><a href='https://dev-api.justholistics.com/adserver/www/delivery/ck.php?n=ac526a88&amp;cb=INSERT_RANDOM_NUMBER_HERE' target='_blank'><img src='https://dev-api.justholistics.com/adserver/www/delivery/avw.php?zoneid=7&amp;cb=INSERT_RANDOM_NUMBER_HERE&amp;n=ac526a88' border='0' alt='' /></a></noscript>

		`,
	},
	{
		advertisement: `
		<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=11");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script><noscript><a href='https://dev-api.justholistics.com/adserver/www/delivery/ck.php?n=aa2b5f51&amp;cb=INSERT_RANDOM_NUMBER_HERE' target='_blank'><img src='https://dev-api.justholistics.com/adserver/www/delivery/avw.php?zoneid=11&amp;cb=INSERT_RANDOM_NUMBER_HERE&amp;n=aa2b5f51' border='0' alt='' /></a></noscript>`,
	},
]

export const sageAdvertisement = [
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
	{
		advertisement: `
		
<!-- Revive Adserver Javascript Tag - Generated with Revive Adserver v5.5.2 -->
<script type='text/javascript'><!--//<![CDATA[
   var m3_u = (location.protocol=='https:'?'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php':'http://dev-api.justholistics.com/adserver/www/delivery/ajs.php');
   var m3_r = Math.floor(Math.random()*99999999999);
   if (!document.MAX_used) document.MAX_used = ',';
   document.write ("<scr"+"ipt type='text/javascript' src='"+m3_u);
   document.write ("?zoneid=13");
   document.write ('&amp;cb=' + m3_r);
   if (document.MAX_used != ',') document.write ("&amp;exclude=" + document.MAX_used);
   document.write (document.charset ? '&amp;charset='+document.charset : (document.characterSet ? '&amp;charset='+document.characterSet : ''));
   document.write ("&amp;loc=" + escape(window.location));
   if (document.referrer) document.write ("&amp;referer=" + escape(document.referrer));
   if (document.context) document.write ("&context=" + escape(document.context));
   document.write ("'></scr"+"ipt>");
//]]>--></script>
		`,
	},
]

export const sampleAdvertisement = [
	{
		id: 1,
		title: 'Office Protocols Made Simple: A Step-by-Step Guide',
		date: 'Jul 25, 2023',
		description:
			'Understanding workplace procedures and their importance is crucial for success in any professional environment. By following procedures, you can promote consistency and efficiency in your work.',
	},
	{
		id: 2,
		title: 'How to Write Work Procedures in 11 Steps (With Examples) - Indeed',
		date: 'Mar 28, 2025',
		description:
			'You can learn how to write work procedures by following these 11 steps: * 1. Select a task. The first step is to determine which task you want to write a proced...',
	},
	{
		id: 3,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
	{
		id: 4,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
	{
		id: 5,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
	{
		id: 6,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
	{
		id: 7,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
	{
		id: 8,
		title: 'Recommended format for a research protocol',
		date: 'Feb 18, 2025',
		description:
			'Project summary. Like the abstract of a research paper, the project summary, should be no more than 300 words and at the most a page long (font size 12, singl...',
	},
]
export const TrendingSort = [
	{ label: 'Trending', value: 'trending' },
	{ label: 'Title', value: 'title' },
	{ label: 'Most recent', value: 'most_recent' },
	{ label: 'Last updated', value: 'last_updated' },
	{ label: 'High User Rating', value: 'high_rating' },
	{ label: 'Most Popular', value: 'most_popular' },
	{ label: 'Most Reviews', value: 'most_reviews' },
	{ label: 'Best Professionalism', value: 'best_professionalism' },
]
export const sideMenuData = [
	{ label: 'Home', icon: '/icons/home.svg', activeIcon: '/icons/active-home.svg', href: '/home' },
	{
		label: 'Search',
		icon: '/icons/magnifying-glass.svg',
		activeIcon: '/icons/active-magnifying-glass.svg',
		href: '/search',
	},
	{
		label: 'Community',
		icon: '/icons/community.svg',
		activeIcon: '/icons/active-community.svg',
		href: '/community',
	},
	{
		label: 'Sage AI',
		icon: '/icons/sage-ai.svg',
		activeIcon: '/icons/active-sage-ai.svg',
		href: '/sage-ai',
	},
	{
		label: 'Discover',
		icon: '/icons/discover.svg',
		activeIcon: '/icons/active-discover.svg',
		href: '/discover',
	},
	{
		label: 'Threads',
		icon: '/icons/threads.svg',
		activeIcon: '/icons/active-threads.svg',
		href: '/threads',
	},
	{
		label: 'Protocols',
		icon: '/icons/protocols.svg',
		activeIcon: '/icons/active-protocols.svg',
		href: '/protocols',
	},
	{
		label: 'Directories',
		icon: '/icons/directories.svg',
		activeIcon: '/icons/active-directories.svg',
		href: '/directories',
	},
	{ label: '', icon: ' ', href: ' ' },
	{
		label: 'Messages',
		icon: '/icons/messages.svg',
		activeIcon: '/icons/active-messages.svg',
		href: '/messages',
	},
	{
		label: 'Notification',
		icon: '/icons/notifications.svg',
		activeIcon: '/icons/active-notifications.svg',
		href: '/notifications',
	},
	{
		label: 'Saved',
		icon: '/icons/saved.svg',
		activeIcon: '/icons/active-saved.svg',
		href: '/saved',
	},
	{
		label: 'Profile',
		icon: '/icons/profile.svg',
		activeIcon: '/icons/active-profile.svg',
		href: '/profile',
	},
]
