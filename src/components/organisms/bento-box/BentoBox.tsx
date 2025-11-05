'use client'
import Post from '@/components/atoms/post/Post'
import Sort from '@/components/atoms/sort/Sort'
//types
import type { SortItem } from '@/components/atoms/sort/Sort'
//styles
import style from './BentoBox.module.scss'

const sortItems: (SortItem | 'divider')[] = [
	{ key: 'title', label: 'Title' },
	{ key: 'trending', label: 'Trending' },
	{ key: 'mostRecent', label: 'Most Recent' },
	{ key: 'mostPopular', label: 'Most Popular' },
]

type BentoBoxProps = {
	title: string
	type: 'group' | 'event' | 'page'
	bentoBoxData?: {
		image_url?: string
		members?: string
		group_name?: string
		date_time?: string
		location?: string
		interested_count?: number
		going_count?: number
		likes_count?: number
		page_name?: string
		service?: string
		ctaLabel?: string
		ctaVariant?: 'primary' | 'secondary' | 'outlined'
	}[]
	ctaLabel?: string
}

const BentoBox = ({ title, type, bentoBoxData, ctaLabel }: BentoBoxProps) => {
	return (
		<div className={`${style.wrapper} `}>
			<div className={style.wrapperHeader}>
				<div className={style.wrapperHeaderTitle}>{title}</div>
				<div className={style.wrapperHeaderActions}>
					<Sort
						items={sortItems}
						align="right"
						triggerClassName={style.wrapperHeaderActionsExtra}
					/>
				</div>
			</div>
			<div className={style.wrapperGrid}>
				{bentoBoxData &&
					bentoBoxData.map((card, idx) => (
						<Post
							key={idx}
							imageUrl={card.image_url}
							membersCount={card.members}
							groupName={card.group_name}
							pageName={card.page_name}
							service={card.service}
							dateTime={card.date_time}
							location={card.location}
							interestedCount={card.interested_count}
							goingCount={card.going_count}
							likesCount={card.likes_count}
							ctaLabel={ctaLabel}
							ctaVariant={card.ctaVariant}
							extraClass={style.wrapperGridExtra}
							footerExtraClass={style.wrapperGridExtraFooter}
							footerContentExtraClass={style.wrapperGridExtraFooterContent}
							type={type}
						/>
					))}
			</div>
		</div>
	)
}

export default BentoBox
