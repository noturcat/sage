'use client'

import { usePathname } from 'next/navigation'
import style from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
	label: string
	href?: string
	isActive?: boolean
	icon?: string
}

interface AdvancedBreadcrumbProps {
	customItems?: BreadcrumbItem[]
	routeMap?: Record<string, string>
	showHome?: boolean
	separator?: string
	className?: string
}

const AdvancedBreadcrumb = ({
	customItems,
	routeMap = {},
	showHome = true,
	separator = '/',
	className = '',
}: AdvancedBreadcrumbProps) => {
	const pathname = usePathname()

	// Default route mappings for common paths
	const defaultRouteMap: Record<string, string> = {
		community: 'Community',
		groups: 'Groups',
		events: 'Events',
		videos: 'Videos',
		pages: 'Pages',
		notifications: 'Notifications',
		discover: 'Discover',
		'business-directory': 'Business Directory',
		protocols: 'Protocols',
		threads: 'Threads',
		'sign-in': 'Sign In',
		'sign-up': 'Sign Up',
		'reset-password': 'Reset Password',
		'remove-email': 'Remove Email',
		...routeMap,
	}

	const generateBreadcrumbs = (): BreadcrumbItem[] => {
		if (customItems) return customItems

		const pathSegments = pathname.split('/').filter(Boolean)
		const breadcrumbs: BreadcrumbItem[] = []

		// Add home if enabled
		if (showHome) {
			breadcrumbs.push({
				label: 'Home',
				href: '/',
				icon: '/icons/home.svg',
			})
		}

		let currentPath = ''
		pathSegments.forEach((segment, index) => {
			currentPath += `/${segment}`
			const isLast = index === pathSegments.length - 1

			// Use custom mapping or generate label
			const label =
				defaultRouteMap[segment] ||
				segment
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')

			breadcrumbs.push({
				label,
				href: isLast ? undefined : currentPath,
				isActive: isLast,
			})
		})

		return breadcrumbs
	}

	const breadcrumbItems = generateBreadcrumbs()

	return (
		<nav className={`${style.breadcrumb} ${className}`} aria-label="Breadcrumb">
			<ol className={style.breadcrumbList}>
				You are here:
				{breadcrumbItems.map((item, index) => (
					<li key={index} className={style.breadcrumbItem}>
						{item.href && !item.isActive ? (
							<a href={item.href} className={style.breadcrumbLink}>
								{item.label}
							</a>
						) : (
							<span
								className={`${style.breadcrumbText} ${item.isActive ? style.active : ''}`}
								aria-current={item.isActive ? 'page' : undefined}
							>
								{item.label}
							</span>
						)}
						{index < breadcrumbItems.length - 1 && (
							<span className={style.separator} aria-hidden="true">
								{separator}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}

export default AdvancedBreadcrumb
