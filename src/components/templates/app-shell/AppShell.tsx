'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/templates/app-shell/header/Header'
import Aside from '@/components/templates/app-shell/aside/Aside'
import Navbar from '@/components/templates/app-shell/navbar/Navbar'
import FilterGroup from '@/components/molecules/filter-group/FilterGroup'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import FloatingButton from '@/components/atoms/floating-button/FloatingButton'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import { useLayout } from '@/hooks/useLayout'
import style from './AppShell.module.scss'

/**
 * **AppShell component** for displaying the app shell.
 *
 * Provides a flexible layout for displaying the header, navbar, and aside.
 *
 * Example:
 *
 * ```tsx
 * <AppShell />
 * ```
 *
 * Notes:
 * - Displays the header if showHeader is true.
 * - Displays the navbar if showNav is true.
 * - Displays the aside if showAside is true.
 * - Displays the main content.
 * - Displays the minimal layout if the layout type is minimal.
 */

function AppShell({ children }: { children: React.ReactNode }) {
	const layout = useLayout()
	const pathname = usePathname()
	const router = useRouter()
	const mainRef = useRef<HTMLDivElement>(null)
	const [isWidthCalculated, setIsWidthCalculated] = useState(false)

	useLayoutEffect(() => {
		if (!mainRef.current) return

		const updateWidth = () => {
			const mainElement = mainRef.current
			if (mainElement) {
				const width = mainElement.offsetWidth
				mainElement.style.setProperty('--main-width', `${width}px`)
				setIsWidthCalculated(true)
			}
		}

		updateWidth()

		const resizeObserver = new ResizeObserver(updateWidth)
		if (mainRef.current) {
			resizeObserver.observe(mainRef.current)
		}

		window.addEventListener('resize', updateWidth)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener('resize', updateWidth)
		}
	}, []) // ✅ Empty array - refs don't need to be dependencies

	const isCommunity = pathname === '/community'
	const isMessages = pathname.includes('/messages')
	const isSage = pathname.includes('/sage-ai')

	if (layout.type === 'none') {
		return <main>{children}</main>
	}

	const createOptions = [
		{
			label: 'Create Protocol',
			href: '/protocols/create-protocol',
		},
		{
			label: 'Create Thread',
			href: '/threads/create-thread',
		},
		{
			label: 'Create Discovery',
			href: '/discover/create-discover',
		},
		{
			label: 'Create Post',
			href: '/posts/create-post',
		},
	]

	return (
		<div className={style.shell}>
			{layout.showHeader && (
				<header className={style.header}>
					<Header />
				</header>
			)}
			<section className={style.body}>
				{layout.showNav && (
					<nav className={style.nav} data-layout-type={layout.type}>
						<Navbar />
					</nav>
				)}
				<section
					className={style.main}
					ref={mainRef}
					data-community={isCommunity ? 'true' : 'false'}
				>
					{isCommunity && (
						<div className={style.filter} data-ready={isWidthCalculated ? '' : undefined}>
							<FilterGroup />
						</div>
					)}
					<main
						className={style.content}
						data-community={isCommunity ? 'true' : 'false'}
						data-messages={isMessages ? 'true' : 'false'}
						data-layout-type={layout.type}
					>
						{children}
					</main>
				</section>
				{layout.showAside && (
					<aside className={style.aside}>
						<Aside />
					</aside>
				)}
			</section>
			{!isSage && !isMessages && (
				<DropdownMenu>
					<DropdownMenu.Trigger>
						<FloatingButton>
							<Tooltip offset={20}>
								<Tooltip.Trigger asChild>
									<div className={style.floatingIcon}>
										<span className={style.iconCreate} />
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content>Create</Tooltip.Content>
							</Tooltip>
						</FloatingButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content className={style.floatingContent}>
						{createOptions.map(option => (
							<DropdownMenu.Item key={option.label} onClick={() => router.push(option.href)}>
								<p>{option.label}</p>
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu>
			)}
		</div>
	)
}

export default AppShell
