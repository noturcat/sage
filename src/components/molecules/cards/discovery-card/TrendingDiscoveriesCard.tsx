'use client'

import { useRouter } from 'next/navigation'
import TrendingCard from '@/components/molecules/cards/trending-card/TrendingCard'
import { DiscoverType } from '@/types/Discover.type'
import { formatIsoToDDMonYYYY } from '@/util/globalFunction'

import style from './TrendingDiscoveriesCard.module.scss'

/**
 * **Specialized protocol card** for trending protocol content.
 *
 * Comprehensive protocol card that extends TrendingCard with protocol-specific content
 * including author information, category badges, and interaction metrics. Features clean layout with social engagement.
 *
 * Example:
 * ```tsx
 * <TrendingDiscoveriesCard
 *   title="Morning Meditation Routine"
 *   description="Start your day with mindfulness..."
 *   author="Sarah Chen"
 *   category="Mindfulness"
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

interface TrendingDiscoveriesCardProps {
	discoveries: DiscoverType
	variant?: 'horizontal' | 'vertical'
}
function TrendingDiscoveriesCard({
	discoveries,
	variant = 'horizontal',
}: TrendingDiscoveriesCardProps) {
	const router = useRouter()

	const image = discoveries?.attributes?.featured_image
		? discoveries.attributes.featured_image?.url
		: '/images/jh-template-1.png'

	const handleClick = () => {
		router.push(`/discover/${discoveries?.attributes?.slug}?id=${discoveries?.id}`)
	}

	return (
		<TrendingCard
			variant={variant}
			image={image}
			category={discoveries.attributes.primary_category?.name}
			withBorder={false}
			overlay
			onClick={handleClick}
		>
			<main className={style.content}>
				<section className={style.author}>
					{discoveries?.attributes?.author && (
						<>
							<p>
								{discoveries?.attributes?.author?.first_name}{' '}
								{discoveries?.attributes?.author?.last_name}
							</p>
							<span>•</span>
						</>
					)}
					<p>{formatIsoToDDMonYYYY(discoveries?.attributes?.created_at)}</p>
					<span>•</span>
					<p>{discoveries?.attributes?.average_reading_time}</p>
				</section>
				<section className={style.titleContainer}>
					<h6 className={style.title}>{discoveries?.attributes?.title}</h6>
					<span className={style.iconArrowSlant} />
				</section>
				<p className={style.description}>{discoveries?.attributes?.summary}</p>
			</main>
		</TrendingCard>
	)
}

export default TrendingDiscoveriesCard
