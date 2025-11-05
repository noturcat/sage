'use client'

import ProfileInfoCard from '@/components/molecules/cards/profile-card/ProfileInfoCard'
import ProfileLinks from '@/components/molecules/carousel/ProfileLinks'
import DemographicCard from '@/components/molecules/cards/profile-card/DemographicCard'
import CardNewsfeed from '@/components/molecules/cards/card-newsfeed/CardNewsfeed'
import RichPostEditor from '@/components/atoms/rich-text-editor/post-editor/RichPostEditor'
import { user } from '@/components/pages/profile/user'
import { links } from '@/components/pages/profile/profileLinks'
import { demographic } from '@/components/pages/profile/userInfo'

import style from './ProfilePage.module.scss'

/**
 * **Profile page** displaying complete user profile information.
 *
 * Main profile page component that renders the comprehensive user profile
 * with cover photo, profile picture, and all associated user information.
 * Integrates ProfileInfoCard for complete profile display functionality.
 *
 * Example:
 * ```tsx
 * <ProfilePage />
 * ```
 *
 * Notes:
 * - Uses static user data from the user module for demonstration.
 * - Renders ProfileInfoCard component with complete user information.
 * - Provides full-page layout with proper styling and spacing.
 * - Integrates cover photo, profile photo, and user details in one view.
 */

function ProfilePage() {
	const newsfeedItems = [
		{
			id: '1',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '12 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '2',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '12 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '3',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '10 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '4',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '12 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '5',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '6 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '6',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '4 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '7',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '2 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
	]

	return (
		<main className={style.wrapper}>
			<ProfileInfoCard user={user} />
			<section className={style.content}>
				<ProfileLinks links={links} />
				<div className={style.grid}>
					<div className={style.demographic}>
						<DemographicCard demographic={demographic} />
					</div>
					<div className={style.posts}>
						<RichPostEditor />
						{newsfeedItems.map(item => (
							<CardNewsfeed
								key={item.id}
								{...item}
								variant={item.variant as 'post' | 'shared' | 'reposted'}
							/>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}

export default ProfilePage
