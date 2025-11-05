import EditProfileModal from '@/components/organisms/modals/edit-profile/EditProfileModal'
import type { User } from '@/components/pages/profile/user'

import style from './ProfileSection.module.scss'

/**
 * **Profile section** with user information and action controls.
 *
 * Displays comprehensive user profile information including name, username,
 * privacy settings, join date, and follower statistics. Features interactive
 * action buttons for content creation and profile editing.
 *
 * Example:
 * ```tsx
 * <ProfileSection user={userData} />
 * ```
 *
 * Notes:
 * - Shows user name and username with proper formatting.
 * - Create New dropdown menu with predefined content options.
 * - Edit Profile button for profile management.
 * - Privacy and join date information with icon indicators.
 * - Follower and following counts with formatted display.
 */

interface ProfileSectionProps {
	user: User
}

function ProfileSection({ user }: ProfileSectionProps) {
	return (
		<main className={style.wrapper}>
			<section className={style.header}>
				<p className={style.user}>
					<span className={style.name}>{user.name}</span>
					<span className={style.username}>/{user.username}</span>
				</p>
				<div className={style.actions}>
					<EditProfileModal />
				</div>
			</section>
			<section className={style.security}>
				<div className={style.privacy}>
					<span className={style.iconWorld} />
					<p>{user.privacy}</p>
				</div>
				<div className={style.joined}>
					<span className={style.iconCalendar} />
					<p>Joined {user.joined}</p>
				</div>
			</section>
			<section className={style.footer}>
				<p className={style.followers}>
					<span className={style.count}>{user.followers}</span>
					<span className={style.label}>Followers</span>
				</p>
				<p className={style.following}>
					<span className={style.count}>{user.following}</span>
					<span className={style.label}>Following</span>
				</p>
			</section>
		</main>
	)
}

export default ProfileSection
