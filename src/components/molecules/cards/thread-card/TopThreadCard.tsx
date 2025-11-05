'use client'

import { useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/avatar/Avatar'
import { ThreadType } from '@/types/Thread.type'

import style from './TopThreadCard.module.scss'

/**
 * **Compact top thread card** with background image and participant info.
 *
 * Minimalist card showcasing top threads with background image, title, and participant information.
 * Features clean layout with overlay content and avatar display for quick thread identification.
 *
 * Example:
 * ```tsx
 * <TopThreadCard
 *   title="Best Morning Routines for Productivity"
 *   avatar="/images/author.jpg"
 *   people="24 people"
 *   image="/images/thread-bg.jpg"
 * />
 * ```
 *
 * Notes:
 * - Dynamic background image with CSS custom properties.
 * - Clean typography with thread title display.
 * - Author/participant section with avatar and count.
 * - Compact design optimized for space efficiency.
 * - Overlay content for optimal text readability.
 */

interface TopThreadCardProps {
	threads: ThreadType
}

function TopThreadCard({ threads }: TopThreadCardProps) {
	const router = useRouter()

	const handleClick = (id: string, slug: string) => {
		router.push(`/threads/${slug}?id=${id}`)
	}

	const image = threads.attributes.featured_image
		? threads.attributes.featured_image?.url
		: '/images/jh-template-1.png'

	return (
		<article
			className={style.card}
			style={
				{
					'--image-url': `url(${image})`,
				} as React.CSSProperties
			}
			onClick={() => handleClick(threads.id.toString(), threads.attributes.slug)}
		>
			<section className={style.content}>
				<header>
					<h6 className={style.title}>{threads.attributes.title}</h6>
				</header>
				<section className={style.avatarGroup}>
					<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={27} />
					<p className={style.people}>
						{threads.attributes.author?.first_name}{' '}
						{threads.attributes.author?.last_name}
					</p>
				</section>
			</section>
		</article>
	)
}

export default TopThreadCard
