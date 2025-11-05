'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { BreadcrumbItem } from '@/components/atoms/breadcrumb/Breadcrumb'

interface UseBreadcrumbsOptions {
	customMappings?: Record<string, string>
	excludeSegments?: string[]
	includeSearchParams?: boolean
}

export const useBreadcrumbs = (options: UseBreadcrumbsOptions = {}) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { customMappings = {}, excludeSegments = [], includeSearchParams = false } = options

	const breadcrumbs = useMemo(() => {
		const segments = pathname.split('/').filter(Boolean)
		const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

		let currentPath = ''
		segments.forEach((segment, index) => {
			// Skip excluded segments
			if (excludeSegments.includes(segment)) return

			currentPath += `/${segment}`
			const isLast = index === segments.length - 1

			// Handle dynamic routes (e.g., [id])
			let label = segment
			if (customMappings[segment]) {
				label = customMappings[segment]
			} else if (segment.match(/^\[.*\]$/)) {
				// This is a dynamic segment, you might want to fetch the actual name
				label = 'Item'
			} else {
				// Convert kebab-case to Title Case
				label = segment
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ')
			}

			items.push({
				label,
				href: isLast ? undefined : currentPath,
				isActive: isLast,
			})
		})

		// Add search params if needed
		if (includeSearchParams && searchParams.toString()) {
			const searchString = searchParams.toString()
			items.push({
				label: `Search: ${searchString}`,
				isActive: true,
			})
		}

		return items
	}, [pathname, searchParams, customMappings, excludeSegments, includeSearchParams])

	return breadcrumbs
}

export default useBreadcrumbs
