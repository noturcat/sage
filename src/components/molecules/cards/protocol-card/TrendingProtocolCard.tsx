import Avatar from '@/components/atoms/avatar/Avatar'
import Pill from '@/components/atoms/pill/Pill'
import TrendingCard from '@/components/molecules/cards/trending-card/TrendingCard'
import type { ProtocolAttributesType } from '@/types/Protocol.type'
import { getTimeElapsed } from '@/util/globalFunction'

import style from './TrendingProtocolCard.module.scss'

/**
 * **Specialized protocol card** for trending protocol content.
 *
 * Comprehensive protocol card that extends TrendingCard with protocol-specific content
 * including author information, category badges, and interaction metrics. Features clean layout with social engagement.
 *
 * Example:
 * ```tsx
 * <TrendingProtocolCard
 *   title="Morning Meditation Routine"
 *   description="Start your day with mindfulness..."
 *   author="Sarah Chen"
 *   category="Mindfulness"
 *   badges={["Meditation", "Wellness"]}
 * />
 * ```
 *
 * Notes:
 * - Extends TrendingCard with protocol-specific content layout.
 * - Author section with avatar, name, and relative timestamp.
 * - Smart badge truncation (shows first 2 badges + ellipsis).
 * - Interaction counters for likes and comments with icons.
 * - Clean typography hierarchy with title and description.
 */

interface TrendingProtocolCardProps {
	protocol: ProtocolAttributesType
	onClick?: () => void
}

function TrendingProtocolCard({ protocol, onClick }: TrendingProtocolCardProps) {
	const image = protocol.featured_image ? protocol.featured_image?.url : '/images/jh-template-1.png'

	return (
		<TrendingCard image={image} category={protocol.category?.name || ''} overlay onClick={onClick}>
			<div className={style.content}>
				<header className={style.titleContainer}>
					<h6 className={style.title}>{protocol.title}</h6>
					<span className={style.iconArrowSlant} />
				</header>
				<p className={style.description}>{protocol.summary}</p>
				<footer className={style.footer}>
					<section className={style.authorSection}>
						<div className={style.authorInfo}>
							<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={19} />
							<p>
								{protocol.author?.first_name || ''} {protocol.author?.last_name || ''}
							</p>
							<span>•</span>
							<p>{getTimeElapsed(protocol.created_at)}</p>
						</div>
						<div className={style.badgeGroup}>
							{protocol.tags?.slice(0, 2).map((tag, index) => (
								<Pill variant="outline" radius="full" className={style.pill} key={index}>
									{tag}
								</Pill>
							))}
							{protocol.tags?.length && protocol.tags.length > 2 && (
								<Pill variant="outline" radius="full" className={style.ellipsis}>
									<span className={style.iconEllipsis} />
								</Pill>
							)}
						</div>
					</section>
					<section className={style.interactions}>
						<span>
							<span className={style.iconChevronUp} />
							10
						</span>
						<span>
							<span className={style.iconChats} />
							10
						</span>
					</section>
				</footer>
			</div>
		</TrendingCard>
	)
}

export default TrendingProtocolCard
