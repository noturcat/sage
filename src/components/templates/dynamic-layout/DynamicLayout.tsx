'use client'

import { usePathname } from 'next/navigation'
import AppShell from '@/components/templates/app-shell/AppShell'
import style from './DynamicLayout.module.scss'

/**
 * **DynamicLayout component** for displaying the dynamic layout.
 *
 * Provides a flexible layout for displaying the header, content, and footer.
 *
 * Example:
 *
 * ```tsx
 * <DynamicLayout />
 * ```
 *
 * Notes:
 * - Displays the header if isHomepage is true.
 * - Displays the content.
 */

interface DynamicLayoutProps {
	header: React.ReactNode
	children: React.ReactNode
	footer: React.ReactNode
}

function DynamicLayout({ header, children, footer }: DynamicLayoutProps) {
	const pathname = usePathname()

	const isHomepage = pathname === '/' || pathname === '/donate'

	return (
		<>
			{isHomepage ? (
				<main className={style.wrapper}>
					<div className={style.header}>{header}</div>
					<div className={style.content}>{children}</div>
					<div className={style.footer}>{footer}</div>
				</main>
			) : (
				<AppShell>{children}</AppShell>
			)}
		</>
	)
}

export default DynamicLayout
