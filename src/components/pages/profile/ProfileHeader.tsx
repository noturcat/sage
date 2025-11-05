'use client'

import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import Avatar from '@/components/atoms/avatar/Avatar'
import Search from '@/components/atoms/search-bar/Search'

import style from './ProfileHeader.module.scss'

/**
 * **Navigation header** for the profile page with actions and search.
 *
 * A feature-rich header component specifically designed for the profile page, providing
 * essential navigation controls, search functionality, and quick access to user-specific
 * actions. Features a clean layout with home navigation, profile posting capabilities,
 * integrated search, and user interaction buttons for a complete profile management experience.
 *
 * Example:
 * ```tsx
 * <ProfileHeader />
 * ```
 *
 * Notes:
 * - Home navigation button for quick return to main page.
 * - Profile posting button for creating new profile content.
 * - Pages button for navigating to the pages section.
 * - Groups button for navigating to the groups section.
 * - Events button for navigating to the events section.
 * - Videos button for navigating to the videos section.
 * - Integrated search functionality for content discovery.
 * - User action buttons for community interaction (users, chats, notifications).
 * - User avatar with profile access and personalization.
 * - Responsive design that adapts to different screen sizes.
 * - Clean, modern interface with consistent button styling.
 */

function ProfileHeader() {
	const router = useRouter()

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

					<CustomButton variant="text" className={style.linkButton} radius="lg">
						<span className={style.iconFlag} />
						Pages
					</CustomButton>
					<CustomButton variant="text" className={style.linkButton} radius="lg">
						<span className={style.iconGroups} />
						Groups
					</CustomButton>
					<CustomButton variant="text" className={style.linkButton} radius="lg">
						<span className={style.iconEvents} />
						Events
					</CustomButton>
					<CustomButton variant="text" className={style.linkButton} radius="lg">
						<span className={style.iconVideo} />
						Videos
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

export default ProfileHeader
