import Pill from '@/components/atoms/pill/Pill'
import CustomButton from '@/components/atoms/button/CustomButton'
import Avatar from '@/components/atoms/avatar/Avatar'
import type { ProtocolAttributesType } from '@/types/Protocol.type'
import { getTimeElapsed } from '@/util/globalFunction'

import style from './FeaturedProtocolCard.module.scss'

/**
 * **Comprehensive protocol card** with background image and interactive elements.
 *
 * Visually rich card showcasing protocol content with gradient overlay, author info,
 * category badges, and engagement metrics. Features truncated badge display and responsive design.
 *
 * Example:
 * ```tsx
 * <FeaturedProtocolCard
 *   title="Morning Meditation Routine"
 *   description="Start your day with mindfulness..."
 *   image="/images/meditation.jpg"
 *   author="Sarah Chen"
 *   badges={["Meditation", "Morning", "Beginner"]}
 *   likes={24}
 *   comments={8}
 * />
 * ```
 *
 * Notes:
 * - Dynamic background image with gradient overlay for text readability.
 * - Truncated badge display (shows first 3 badges + ellipsis).
 * - Author section with avatar, name, and timestamp.
 * - Interactive elements with like and comment counters.
 */

interface FeaturedProtocolCardProps {
	protocol: ProtocolAttributesType
	onClick?: () => void
}

function FeaturedProtocolCard({ protocol, onClick }: FeaturedProtocolCardProps) {
	const image = protocol.featured_image
		? protocol.featured_image?.url
		: '/images/jh-template-1.png'

	return (
		<article
			className={style.card}
			style={
				{
					'--image-url': `url(${image})`,
				} as React.CSSProperties
			}
			onClick={onClick}
		>
			<section className={style.content}>
				<div className={style.authorInfo}>
					<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={27} />
					<p>
						{protocol.author?.first_name || ''} {protocol.author?.last_name || ''}
					</p>
					<span>•</span>
					<p>{getTimeElapsed(protocol.created_at)}</p>
				</div>
				<div>
					<CustomButton radius="full" variant="secondary" size="lg">
						{protocol.category?.name || ''}
						<span className={style.iconArrowSlant} />
					</CustomButton>
				</div>
				<header>
					<h6 className={style.title}>{protocol.title}</h6>
				</header>
				<p className={style.description}>{protocol.summary}</p>

				<footer className={style.footer}>
					<section className={style.authorSection}>
						<div className={style.badgeGroup}>
							{protocol.tags?.slice(0, 3).map((tag, index) => (
								<Pill variant="outline" radius="full" key={index} className={style.pill}>
									{tag}
								</Pill>
							))}
							{protocol.tags?.length && protocol.tags.length > 3 && (
								<Pill variant="outline" radius="full" className={style.ellipsis}>
									<span className={style.iconEllipsis} />
								</Pill>
							)}
						</div>
					</section>
					<section className={style.interactions}>
						<span>
							<span className={style.iconChevronUp} />
							100
						</span>
						<span>
							<span className={style.iconChats} />
							10
						</span>
					</section>
				</footer>
			</section>
		</article>
	)
}

export default FeaturedProtocolCard
