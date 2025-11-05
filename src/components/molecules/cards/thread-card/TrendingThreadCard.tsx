'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Avatar from '@/components/atoms/avatar/Avatar'
import TrendingCard from '@/components/molecules/cards/trending-card/TrendingCard'
import { ThreadType } from '@/types/Thread.type'

import style from './TrendingThreadCard.module.scss'

/**
 * **Specialized thread card** for trending thread content.
 *
 * Comprehensive thread card component that extends TrendingCard with thread-specific content
 * including author information, category display, and comment counts. Features clean layout with social engagement metrics.
 *
 * Example:
 * ```tsx
 * <TrendingThreadCard
 *   title="Best Morning Routines for Remote Workers"
 *   description="Share your favorite morning routines..."
 *   author="Sarah Chen"
 *   category="Productivity"
 *   comments={24}
 * />
 * ```
 *
 * Notes:
 * - Extends TrendingCard with thread-specific content layout.
 * - Author section with avatar, name, and metadata.
 * - Category display with stack icon for thread organization.
 * - Comment count with chat icon for engagement metrics.
 * - Interactive title with arrow icon for navigation.
 */

interface TrendingThreadCardProps {
	threads: ThreadType
}

function TrendingThreadCard({ threads }: TrendingThreadCardProps) {
	const router = useRouter()

	const handleClick = (id: string, slug: string) => {
		router.push(`/threads/${slug}?id=${id}`)
	}

	const image = threads.attributes.featured_image
		? threads.attributes.featured_image?.url
		: '/images/jh-template-1.png'

	return (
		<TrendingCard
			image={image}
			onClick={() => handleClick(threads.id.toString(), threads.attributes.slug)}
		>
			<div className={style.content}>
				<header className={style.titleContainer}>
					<h6 className={style.title}>{threads.attributes.title}</h6>
					<Image src="/icons/arrow-slant.svg" alt="Arrow Slant" width={12} height={12} />
				</header>
				<p className={style.description}>{threads.attributes.summary}</p>
				<footer className={style.footer}>
					<section className={style.authorSection}>
						<div className={style.authorInfo}>
							<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={19} />
							<p>
								{threads.attributes.author?.first_name} {threads.attributes.author?.last_name}
							</p>
						</div>
						<div className={style.contentInfo}>
							<span className={style.iconContainer}>
								<span className={style.iconStack} />
								{threads.attributes.category?.name}
							</span>
							<span className={style.iconContainer}>
								<span className={style.iconChats} />
								12
							</span>
						</div>
					</section>
				</footer>
			</div>
		</TrendingCard>
	)
}

export default TrendingThreadCard
