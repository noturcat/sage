'use client'

import { useState } from 'react'
import Avatar from '@/components/atoms/avatar/Avatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './Follow.module.scss'

/**
 * **Interactive follow component** with user profile and follow button.
 *
 * Displays user profile information with avatar, name, description, and interactive follow button.
 * Features toggle functionality between follow and following states with visual feedback.
 *
 * Example:
 * ```tsx
 * <Follow
 *   name="John Doe"
 *   description="A passionate wellness advocate..."
 *   image="/images/user.jpg"
 * />
 * ```
 *
 * Notes:
 * - Interactive follow button with toggle functionality.
 * - Visual feedback for follow/following states.
 * - User profile display with avatar, name, and description.
 * - Responsive design with consistent spacing and typography.
 */

interface FollowProps {
	name?: string
	description?: string
	image?: string
}

function Follow({
	name = 'John Doe',
	description = 'A passionate wellness advocate and certified holistic nutritionist, Emma helps people achieve balance through mindful eating and natural healing. She believes that food is medicine and shares her expertise on plant-based diets and gut health.',
	image = '/images/auth-bg.png',
}: FollowProps) {
	const [isFollowing, setIsFollowing] = useState(false)

	const handleFollow = () => {
		setIsFollowing(!isFollowing)
	}
	return (
		<main className={style.wrapper}>
			<section className={style.authorWrapper}>
				<Avatar src={image} size={36} />
				<div className={style.authorInfo}>
					<h6 className={style.authorName}>{name}</h6>
					<p className={style.authorDescription}>{description}</p>
				</div>
			</section>
			<CustomButton
				variant={isFollowing ? 'secondary' : 'outline'}
				radius="full"
				className={isFollowing ? style.followingButton : style.followButton}
				onClick={handleFollow}
			>
				{isFollowing ? 'Following' : 'Follow'}
			</CustomButton>
		</main>
	)
}

export default Follow
