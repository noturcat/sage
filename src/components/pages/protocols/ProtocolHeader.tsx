'use client'

import { usePathname, useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import Avatar from '@/components/atoms/avatar/Avatar'
import Search from '@/components/atoms/search-bar/Search'

import style from './ProtocolHeader.module.scss'

/**
 * **Navigation header** for the protocols page with actions and search.
 *
 * Page-specific header component providing protocol submission, search functionality,
 * and quick access to user actions like chats, notifications, and profile.
 *
 * Example:
 * ```tsx
 * <ProtocolHeader />
 * ```
 *
 * Notes:
 * - Home navigation button with router integration.
 * - Protocol submission action with conditional visibility.
 * - Integrated search functionality for protocol discovery.
 * - User action buttons (users, chats, notifications).
 * - User avatar with profile access and configurable size.
 * - Responsive layout with organized action sections.
 */

function ProtocolHeader() {
	const router = useRouter()
	const pathname = usePathname()

	// Show submit button on main page and slug routes, but not on create/publish pages
	const showSubmitButton =
		pathname === '/protocols' ||
		(pathname.startsWith('/protocols/') && !pathname.startsWith('/protocols/create-protocol'))

	const handleSubmitProtocol = () => {
		router.push('/protocols/create-protocol')
	}

	const handleHome = () => {
		router.push('/')
	}

	return (
		<main className={style.wrapper}>
			<div className={style.container}>
				<section className={style.title}>
					<CustomButton size="icon" className={style.homeButton} radius="full" onClick={handleHome}>
						<span className={style.iconHome} />
					</CustomButton>

					<CustomButton
						className={style.submitButton}
						radius="full"
						size="lg"
						data-hidden={!showSubmitButton}
						onClick={handleSubmitProtocol}
					>
						<span className={style.iconPlus} />
						Submit Protocol
					</CustomButton>
				</section>
				<section className={style.actions}>
					<Search />
					<CustomButton size="icon" className={style.usersButton} radius="full">
						<span className={style.iconUsers} />
					</CustomButton>
					<CustomButton size="icon" className={style.chatsButton} radius="full">
						<span className={style.iconChats} />
					</CustomButton>
					<CustomButton size="icon" className={style.notificationsButton} radius="full">
						<span className={style.iconNotifications} />
					</CustomButton>
					<CustomButton size="icon" className={style.avatarButton} radius="full">
						<Avatar size={32} src="/images/1.jpg" extraClass={style.avatar} />
					</CustomButton>
				</section>
			</div>
		</main>
	)
}

export default ProtocolHeader
