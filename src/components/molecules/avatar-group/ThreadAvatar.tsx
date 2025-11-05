import Avatar from '@/components/atoms/avatar/Avatar'
import style from './ThreadAvatar.module.scss'

/**
 * **Author profile display** with thread engagement metrics.
 *
 * Comprehensive author presentation component that combines user avatar with detailed
 * thread metadata and engagement statistics. Displays author credentials alongside key thread metrics.
 *
 * Example:
 * ```tsx
 * <ThreadAvatar
 *   category="Regenerative Farming"
 *   authorName="John Doe"
 *   authorRole="Software Engineer"
 *   avatar="/images/avatar.jpg"
 *   threadData={{
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

interface ThreadData {
	date: string
	readTime: string
	visits: string
	replies: string
}

interface ThreadAvatarProps {
	category: string
	authorName: string
	authorRole: string
	avatar: string
	threadData: ThreadData
}

function ThreadAvatar({ category, authorName, authorRole, avatar, threadData }: ThreadAvatarProps) {
	return (
		<main className={style.wrapper}>
			<Avatar src={avatar} alt={authorName} size={40} />
			<section className={style.threadInfo}>
				<p className={style.authorInfo}>
					<span className={style.authorName}>{authorName},</span>
					<span className={style.authorRole}>{authorRole}</span>
				</p>
				<p className={style.threadData}>
					<span>{category}</span>
					<span>|</span>
					<span>{threadData.date}</span>
					<span>|</span>
					<span>{threadData.readTime}</span>
					<span>|</span>
					<span>{threadData.visits}</span>
					<span>|</span>
					<span>{threadData.replies}</span>
				</p>
			</section>
		</main>
	)
}

export default ThreadAvatar
