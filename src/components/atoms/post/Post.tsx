import Image from 'next/image'

import ButtonPill from '@/components/atoms/button/ButtonPill'
import ButtonIcon from '../button/ButtonIcon'
import style from './Post.module.scss'
import { formatNumber } from '@/util/numberFormatter'

type PostProps = {
	imageUrl?: string
	imageAlt?: string
	membersCount?: string
	groupName?: string
	dateTime?: string
	location?: string
	interestedCount?: number
	goingCount?: number
	ctaLabel?: string
	ctaActiveLabel?: string
	ctaVariant?: 'primary' | 'secondary' | 'outlined'
	showCta?: boolean
	onCtaClick?: () => void
	extraClass?: string
	bgColor?: string
	footerExtraClass?: string
	footerContentExtraClass?: string
	type?: 'group' | 'event' | 'newsfeed' | 'page'
	pageName?: string
	service?: string
	likesCount?: number
}

const Post = ({
	imageUrl,
	imageAlt = 'newsfeed image',
	membersCount,
	groupName,
	dateTime,
	location,
	interestedCount,
	goingCount,
	ctaLabel = 'Join',
	ctaActiveLabel,
	ctaVariant = 'primary',
	showCta = true,
	onCtaClick,
	bgColor = '',
	extraClass,
	footerExtraClass,
	footerContentExtraClass,
	type,
	pageName,
	service,
	likesCount,
}: PostProps) => {
	return (
		<div className={`${style.postWrapper} ${extraClass ?? ''}`}>
			<div
				className={`${style.postImageWrapper} ${bgColor ? style[bgColor] : ''} ${type === 'event' ? style.event : ''} ${type === 'group' ? style.group : ''} ${type === 'page' ? style.page : ''} ${type === 'newsfeed' ? style.newsfeed : ''}`}
			>
				<Image src={imageUrl ?? ''} alt={imageAlt} fill className={style.postImageScaled} />
			</div>
			{(type === 'group' || type === 'newsfeed') && (
				<div className={`${style.postImageFooter} ${footerExtraClass ?? ''}`}>
					<div className={`${style.postImageFooterContent} ${footerContentExtraClass ?? ''}`}>
						<div className={style.postImageFooterContentTitle}>{membersCount}</div>
						<div className={style.postImageFooterContentSubtitle}>{groupName}</div>
					</div>
					{showCta && (
						<ButtonPill
							label={ctaLabel}
							activeLabel={ctaActiveLabel}
							variant={ctaVariant}
							onClick={onCtaClick}
						/>
					)}
				</div>
			)}
			{(type === 'event' || type === 'page') && (
				<div className={`${style.postImageFooter} ${footerExtraClass ?? ''}`}>
					<div className={`${style.postImageFooterContent} ${footerContentExtraClass ?? ''}`}>
						{type === 'event' && (
							<>
								<div className={style.postImageFooterContentTitle}>{dateTime}</div>
								<div className={style.postImageFooterContentSubtitle}>{groupName}</div>
								<div className={style.postImageFooterContentLocation}>{location}</div>

								<div className={style.postImageFooterContentCountWrapper}>
									<span className={style.postImageFooterContentCount}>
										{formatNumber(interestedCount)} Interested
									</span>
									<span className={style.postImageFooterContentCount}>
										{formatNumber(goingCount)} Going
									</span>
								</div>
							</>
						)}
						{type === 'page' && (
							<>
								<div className={style.postImageFooterContentSubtitle}>{pageName}</div>
								<div className={style.postImageFooterContentLocation}>{service}</div>
								<div className={style.postImageFooterContentCountWrapper}>
									<span className={style.postImageFooterContentCount}>
										{formatNumber(likesCount)} Likes
									</span>
								</div>
							</>
						)}
					</div>
					{showCta && (
						<div className={style.postImageFooterContentCtaWrapper}>
							{type === 'event' && (
								<>
									<ButtonPill
										label={ctaLabel}
										activeLabel={ctaActiveLabel}
										variant={ctaVariant}
										onClick={onCtaClick}
										extraClass={style.extra}
									/>

									<ButtonIcon
										key={'Share'}
										icon={'/icons/share.svg'}
										label={''}
										variant="circular"
										styleType="icon"
										size={12}
										iconPos="append"
										extraClass={style.extra}
									/>
								</>
							)}
							{type === 'page' && (
								<ButtonPill
									label={ctaLabel}
									activeLabel={ctaActiveLabel}
									variant={ctaVariant}
									onClick={onCtaClick}
									extraClass={style.extra}
								/>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Post
