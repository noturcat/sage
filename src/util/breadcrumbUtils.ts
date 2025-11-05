import { BreadcrumbItem } from '@/components/atoms/breadcrumb/Breadcrumb'

export interface BreadcrumbConfig {
	[key: string]: {
		label: string
		href?: string
		parent?: string
	}
}

const defaultBreadcrumbConfig: BreadcrumbConfig = {
	'/': { label: 'Home' },
	'/community': { label: 'Community', parent: '/' },
	'/community/pages': { label: 'Pages', parent: '/community' },
	'/community/groups': { label: 'Groups', parent: '/community' },
	'/community/events': { label: 'Events', parent: '/community' },
	'/community/videos': { label: 'Videos', parent: '/community' },
	'/protocols': { label: 'Protocols', parent: '/' },
	'/discover': { label: 'Discover', parent: '/' },
	'/business-directory': { label: 'Business Directory', parent: '/' },
	'/threads': { label: 'Threads', parent: '/' },
	'/profile': { label: 'Profile', parent: '/' },
	'/settings': { label: 'Settings', parent: '/' },
	'/about': { label: 'About', parent: '/' },
	'/contact': { label: 'Contact', parent: '/' },
	'/privacy': { label: 'Privacy Policy', parent: '/' },
	'/terms': { label: 'Terms of Service', parent: '/' },
}

/**
 * Generates breadcrumb items from a pathname and optional configuration
 * @param pathname - The current pathname (e.g., '/community/pages')
 * @param config - Optional custom breadcrumb configuration
 * @param customItems - Optional custom breadcrumb items to prepend
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
	pathname: string,
	config: BreadcrumbConfig = defaultBreadcrumbConfig,
	customItems: BreadcrumbItem[] = []
): BreadcrumbItem[] {
	if (!pathname || pathname === '/') {
		return customItems.length > 0 ? customItems : [{ label: 'Home', href: '/', isActive: true }]
	}

	const pathSegments = pathname.split('/').filter(Boolean)
	const breadcrumbs: BreadcrumbItem[] = [...customItems]

	let currentPath = ''

	for (let i = 0; i < pathSegments.length; i++) {
		currentPath += `/${pathSegments[i]}`
		const isLast = i === pathSegments.length - 1

		const pathConfig = config[currentPath]

		if (pathConfig) {
			breadcrumbs.push({
				label: pathConfig.label,
				href: isLast ? undefined : pathConfig.href || currentPath,
				isActive: isLast,
			})
		} else {
			const label = pathSegments[i]
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')

			breadcrumbs.push({
				label,
				href: isLast ? undefined : currentPath,
				isActive: isLast,
			})
		}
	}

	return breadcrumbs
}

/**
 * Generates breadcrumb items for dynamic routes with parameters
 * @param pathname - The current pathname
 * @param params - Route parameters (e.g., { id: '123', slug: 'example' })
 * @param config - Optional custom breadcrumb configuration
 * @returns Array of breadcrumb items
 */
export function generateDynamicBreadcrumbs(
	pathname: string,
	params: Record<string, string> = {},
	config: BreadcrumbConfig = defaultBreadcrumbConfig
): BreadcrumbItem[] {
	let processedPathname = pathname

	Object.entries(params).forEach(([key, value]) => {
		processedPathname = processedPathname.replace(`[${key}]`, value)
	})

	return generateBreadcrumbs(processedPathname, config)
}

/**
 * Creates a breadcrumb configuration for a specific page
 * @param label - The page label
 * @param parentPath - The parent path
 * @param href - Optional custom href
 * @returns Breadcrumb configuration object
 */
export function createBreadcrumbConfig(
	label: string,
	parentPath: string,
	href?: string
): BreadcrumbConfig {
	return {
		[parentPath]: {
			label,
			href: href || parentPath,
			parent: parentPath === '/' ? undefined : '/',
		},
	}
}

/**
 * Merges multiple breadcrumb configurations
 * @param configs - Array of breadcrumb configurations
 * @returns Merged configuration object
 */
export function mergeBreadcrumbConfigs(...configs: BreadcrumbConfig[]): BreadcrumbConfig {
	return configs.reduce((merged, config) => ({ ...merged, ...config }), {})
}
