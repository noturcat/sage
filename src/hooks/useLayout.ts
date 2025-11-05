'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

/**
 * **useLayout hook** for managing the layout of the app.
 *
 * Provides a flexible layout for displaying the header, navbar, and aside.
 *
 * Example:
 *
 * ```tsx
 * const layout = useLayout()
 * ```
 *
 * Notes:
 * - Displays the minimal layout if the layout type is minimal.
 * - Displays the collapsed layout if the layout type is collapsed.
 * - Displays the full layout if the layout type is full.
 */

export type LayoutType =
	| 'full'
	| 'collapsed'
	| 'minimal'
	| 'compact'
	| 'collapsedNavbarOnly'
	| 'none'

export interface LayoutConfig {
	type: LayoutType
	showHeader: boolean
	showNav: boolean
	showAside: boolean
	isNavCollapsed: boolean
	showCommunityLinks: boolean
	showTrendingNow: boolean
	showMostReplies: boolean
	showMostPopular: boolean
	showSponsored: boolean
	showWhoToFollow: boolean
	showRecommendedTopics: boolean
}

const ROUTE_PATTERNS = {
	minimal: ['/community/pages', '/community/groups', '/community/events', '/community/videos'],
	collapsed: ['/protocols', '/threads', '/discover'],
	compact: ['/sage-ai', '/profile'],
	collapsedNavbarOnly: ['/directories', '/messages', '/dashboard'],
	none: [
		'/auth',
		'/login',
		'/register',
		'/onboarding',
		'/protocols/create-protocol',
		'/threads/create-thread',
		'/discover/create-discover',
		'/donate',
	],
} as const

const SLUG_PATTERNS = {
	protocol: /^\/protocols\/[^\/]+$/,
	thread: /^\/threads\/[^\/]+$/,
	discover: /^\/discover\/[^\/]+$/,
	directories: /^\/directories\/[^\/]+$/,
} as const

export const useLayout = (): LayoutConfig => {
	const pathname = usePathname()

	return useMemo(() => {
		const isMinimalLayout = ROUTE_PATTERNS.minimal.some(
			route => pathname.includes(route) || pathname === route
		)

		const isCollapsedLayout = ROUTE_PATTERNS.collapsed.some(
			route => pathname.includes(route) && !pathname.includes('/create-')
		)

		const isCompactLayout = ROUTE_PATTERNS.compact.some(
			route => pathname === route || pathname.startsWith(route + '/')
		)

		const isNoneLayout = ROUTE_PATTERNS.none.some(
			route => pathname.includes(route) || pathname === route
		)

		const isCollapsedNavbarOnlyLayout = ROUTE_PATTERNS.collapsedNavbarOnly.some(
			route => pathname.includes(route) || pathname === route
		)

		const isCommunity = pathname.includes('/community')
		const isProtocolSlug = SLUG_PATTERNS.protocol.test(pathname)
		const isThreadsSlug = SLUG_PATTERNS.thread.test(pathname)
		const isDiscoverSlug = SLUG_PATTERNS.discover.test(pathname)
		const isDirectorySlug = SLUG_PATTERNS.directories.test(pathname)
		const isAnySlugPage = isProtocolSlug || isThreadsSlug || isDiscoverSlug || isDirectorySlug

		const layouts: Record<LayoutType, LayoutConfig> = {
			minimal: {
				type: 'minimal',
				showHeader: true,
				showNav: false,
				showAside: false,
				isNavCollapsed: false,
				showCommunityLinks: true,
				showWhoToFollow: false,
				showTrendingNow: false,
				showMostReplies: false,
				showMostPopular: false,
				showSponsored: false,
				showRecommendedTopics: false,
			},
			collapsed: {
				type: 'collapsed',
				showHeader: true,
				showNav: true,
				showAside: true,
				isNavCollapsed: true,
				showCommunityLinks: isCommunity,
				showWhoToFollow: !isAnySlugPage,
				showTrendingNow: isProtocolSlug,
				showMostReplies: isThreadsSlug,
				showMostPopular: isDiscoverSlug,
				showSponsored: !isAnySlugPage,
				showRecommendedTopics: true,
			},
			compact: {
				type: 'compact',
				showHeader: true,
				showNav: true,
				showAside: false,
				isNavCollapsed: false,
				showCommunityLinks: false,
				showWhoToFollow: false,
				showTrendingNow: false,
				showMostReplies: false,
				showMostPopular: false,
				showSponsored: false,
				showRecommendedTopics: false,
			},
			collapsedNavbarOnly: {
				type: 'collapsedNavbarOnly',
				showHeader: true,
				showNav: true,
				showAside: false,
				isNavCollapsed: true,
				showCommunityLinks: false,
				showWhoToFollow: false,
				showTrendingNow: false,
				showMostReplies: false,
				showMostPopular: false,
				showSponsored: false,
				showRecommendedTopics: false,
			},
			full: {
				type: 'full',
				showHeader: true,
				showNav: true,
				showAside: true,
				isNavCollapsed: false,
				showCommunityLinks: isCommunity,
				showWhoToFollow: true,
				showTrendingNow: false,
				showMostReplies: false,
				showMostPopular: false,
				showSponsored: true,
				showRecommendedTopics: false,
			},
			none: {
				type: 'none',
				showHeader: false,
				showNav: false,
				showAside: false,
				isNavCollapsed: false,
				showCommunityLinks: false,
				showWhoToFollow: false,
				showTrendingNow: false,
				showMostReplies: false,
				showMostPopular: false,
				showSponsored: false,
				showRecommendedTopics: false,
			},
		}

		if (isNoneLayout) {
			return layouts.none
		}

		if (pathname === '/community') {
			return layouts.full
		}

		if (pathname.startsWith('/community/')) {
			return layouts.minimal
		}

		if (isMinimalLayout) {
			return layouts.minimal
		}

		if (isCollapsedLayout) {
			return layouts.collapsed
		}

		if (isCompactLayout) {
			return layouts.compact
		}

		if (isCollapsedNavbarOnlyLayout) {
			return layouts.collapsedNavbarOnly
		}

		return layouts.full
	}, [pathname])
}
