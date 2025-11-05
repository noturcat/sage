import Image from 'next/image'
import ProfileSection from '@/components/molecules/item-group/ProfileSection'
import EditCoverPhoto from '@/components/molecules/cards/profile-card/EditCoverPhoto'
import type { User } from '@/components/pages/profile/user'

import style from './ProfileInfoCard.module.scss'

/**
 * **Profile information card** with cover photo and user details.
 *
 * Displays a user's profile with a cover photo background, profile picture,
 * and associated profile information section. Features responsive image handling
 * with Next.js Image optimization.
 *
 * Example:
 * ```tsx
 * <ProfileInfoCard
 *   coverPhotoUrl="/custom-cover.jpg"
 *   profilePhotoUrl="/user-avatar.jpg"
 *   alt="User profile cover"
 * />
 * ```
 *
 * Notes:
 * - Cover photo fills the entire top section with priority loading.
 * - Profile photo is displayed as a circular image overlay.
 * - Integrates with ProfileSection component for user information display.
 * - Uses Next.js Image component for optimized loading and performance.
 * - Default images provided for fallback scenarios.
 */

interface ProfileInfoCardProps {
	user: User
}

function ProfileInfoCard({ user }: ProfileInfoCardProps) {
	return (
		<main className={style.wrapper}>
			<section className={style.cover}>
				<Image
					src={user.cover}
					alt={user.cover}
					fill
					className={style.coverPhoto}
					sizes="100%"
					priority
				/>
				<EditCoverPhoto />
			</section>
			<section className={style.info}>
				<div className={style.profile}>
					<Image
						src={user.profile}
						alt={user.profile}
						sizes="100%"
						fill
						className={style.profilePhoto}
					/>
				</div>
				<ProfileSection user={user} />
			</section>
		</main>
	)
}

export default ProfileInfoCard
