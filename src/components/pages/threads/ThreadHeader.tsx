'use client'

import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import Avatar from '@/components/atoms/avatar/Avatar'
import Search from '@/components/atoms/search-bar/Search'

import style from './ThreadHeader.module.scss'

/**
 * **Navigation header** for the threads page with actions and search.
 *
 * A feature-rich header component specifically designed for the threads page, providing
 * essential navigation controls, search functionality, and quick access to user-specific
 * actions. Features a clean layout with home navigation, thread posting capabilities,
 * integrated search, and user interaction buttons for a complete thread management experience.
 *
 * Example:
 * ```tsx
 * <ThreadHeader />
 * ```
 *
 * Notes:
 * - Home navigation button for quick return to main page.
 * - Thread posting button for creating new thread content.
 * - Integrated search functionality for content discovery.
 * - User action buttons for community interaction (users, chats, notifications).
 * - User avatar with profile access and personalization.
 * - Responsive design that adapts to different screen sizes.
 * - Clean, modern interface with consistent button styling.
 */

function ThreadHeader() {
	const router = useRouter()
	// const pathname = usePathname()

	// // Show submit button on main page and slug routes, but not on create/publish pages
	// const showSubmitButton =
	// 	pathname === '/protocols' ||
	// 	(pathname.startsWith('/protocols/') && !pathname.startsWith('/protocols/create-protocol'))

	// const handleSubmitProtocol = () => {
	// 	router.push('/protocols/create-protocol')
	// }

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
						className={style.postButton}
						radius="full"
						size="lg"
						// data-hidden={!showSubmitButton}
						// onClick={handleSubmitProtocol}
					>
						<span className={style.iconPencil} />
						Post
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

export default ThreadHeader
