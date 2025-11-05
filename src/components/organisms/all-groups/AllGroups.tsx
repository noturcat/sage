'use client'
import Post from '@/components/atoms/post/Post'
import Sort from '@/components/atoms/sort/Sort'
//types
import type { SortItem } from '@/components/atoms/sort/Sort'
//styles
import style from './AllGroups.module.scss'

const mockGroupCards = [
	{
		imageUrl: '/images/newsfeed-image.jpg',
		membersCount: '3,606 MEMBERS',
		groupName: 'Herbalism: The Holistic Approach for Health Improvement',
	},
	{
		imageUrl: '/images/newsfeed-image.jpg',
		membersCount: '2,210 MEMBERS',
		groupName: 'Yoga and Breathwork Circle',
	},
	{
		imageUrl: '/images/newsfeed-image.jpg',
		membersCount: '12,431 MEMBERS',
		groupName: 'Regenerative Farming Collective',
	},
	{
		imageUrl: '/images/newsfeed-image.jpg',
		membersCount: '12,431 MEMBERS',
		groupName: 'Regenerative Farming Collective',
	},
]
const sortItems: (SortItem | 'divider')[] = [
	{ key: 'title', label: 'Title' },
	{ key: 'trending', label: 'Trending' },
	{ key: 'mostRecent', label: 'Most Recent' },
	{ key: 'mostPopular', label: 'Most Popular' },
]
const AllGroups = () => {
	return (
		<div className={`${style.wrapper} `}>
			<div className={style.wrapperHeader}>
				<div className={style.wrapperHeaderTitle}>All Groups</div>
				<div className={style.wrapperHeaderActions}>
					<Sort items={sortItems} align="right" />
				</div>
			</div>
			<div className={style.wrapperGrid}>
				{mockGroupCards.map((card, idx) => (
					<Post
						key={idx}
						imageUrl={card.imageUrl}
						membersCount={card.membersCount}
						groupName={card.groupName}
						ctaLabel="Join Group"
						ctaVariant="primary"
						extraClass={style.wrapperGridExtra}
						footerExtraClass={style.wrapperGridExtraFooter}
						footerContentExtraClass={style.wrapperGridExtraFooterContent}
					/>
				))}
			</div>
		</div>
	)
}

export default AllGroups
