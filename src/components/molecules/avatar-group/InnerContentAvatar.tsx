import Avatar from '@/components/atoms/avatar/Avatar'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { formatIsoToLongDate } from '@/util/globalFunction'

import style from './InnerContentAvatar.module.scss'

/**
 * **Author profile display** with thread engagement metrics.
 *
 * Comprehensive author presentation component that combines user avatar with detailed
 * thread metadata and engagement statistics. Displays author credentials alongside key thread metrics.
 *
 * Example:
 * ```tsx
 * <InnerContentAvatar
 *   category="Regenerative Farming"
 *   authorName="John Doe"
 *   authorRole="Software Engineer"
 *   avatar="/images/avatar.jpg"
 *   innerContentData={{
 *     date: "2021-01-01",
 *     readTime: "10 min",
 *     visits: "100",
 *     replies: "5"
 *   }}
 * />
 * ```
 *
 * Notes:
 * - Author avatar display with configurable size and image source.
 * - Author name and professional role presentation with clear hierarchy.
 * - Thread metadata display including category, date, read time, visits, and replies.
 * - Pipe-separated data format for clean visual organization.
 * - Responsive layout with optimized spacing and typography.
 */

interface InnerContentAvatarProps {
	variant?: 'protocol' | 'thread' | 'discovery'
	category: string
	name: string
	role: string
	avatar: string
	date: string
	readTime: string
	visits: string
	replies: string
	loading?: boolean
}

function InnerContentAvatar({
	variant = 'protocol',
	category,
	name,
	role,
	avatar,
	date,
	readTime,
	visits,
	replies,
	loading = false,
}: InnerContentAvatarProps) {
	return (
		<main className={style.wrapper}>
			{loading ? (
				<Skeleton className={style.avatarSkeleton} />
			) : (
				<Avatar src={avatar} alt={name} size={40} />
			)}
			<section className={style.content}>
				{loading ? (
					<div className={style.author}>
						<Skeleton className={style.authorSkeleton} />
						<Skeleton className={style.authorSkeleton} />
					</div>
				) : (
					<p className={style.author}>
						<span className={style.name}>{name},</span>
						<span className={style.role}>{role}</span>
					</p>
				)}

				<div className={style.data}>
					{variant !== 'protocol' && (
						<>
							{loading ? <Skeleton className={style.dataSkeleton} /> : <span>{category}</span>}
							<span>|</span>
						</>
					)}
					{loading ? (
						<Skeleton className={style.dataSkeleton} />
					) : (
						<span>{formatIsoToLongDate(date)}</span>
					)}
					<span>|</span>
					{loading ? <Skeleton className={style.dataSkeleton} /> : <span>{readTime}</span>}
					<span>|</span>
					{loading ? <Skeleton className={style.dataSkeleton} /> : <span>{visits}</span>}
					<span>|</span>
					{loading ? <Skeleton className={style.dataSkeleton} /> : <span>{replies}</span>}
				</div>
			</section>
		</main>
	)
}

export default InnerContentAvatar
