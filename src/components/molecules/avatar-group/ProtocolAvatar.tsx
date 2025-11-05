import Avatar from '@/components/atoms/avatar/Avatar'
import style from './ProtocolAvatar.module.scss'

/**
 * **Author profile display** with protocol engagement metrics.
 *
 * Comprehensive author presentation component that combines user avatar with detailed
 * protocol metadata and engagement statistics. Displays author credentials alongside key protocol metrics.
 *
 * Example:
 * ```tsx
 * <ProtocolAvatar
 *   authorName="John Doe"
 *   authorRole="Software Engineer"
 *   avatar="/images/avatar.jpg"
 *   protocolData={{
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
 * - Protocol metadata display including date, read time, visits, and replies.
 * - Pipe-separated data format for clean visual organization.
 * - Responsive layout with optimized spacing and typography.
 */

interface ProtocolData {
	date: string
	readTime: string
	visits: string
	replies: string
}

interface ProtocolAvatarProps {
	authorName: string
	authorRole: string
	avatar: string
	protocolData: ProtocolData
}

function ProtocolAvatar({ authorName, authorRole, avatar, protocolData }: ProtocolAvatarProps) {
	return (
		<main className={style.wrapper}>
			<Avatar src={avatar} alt={authorName} size={40} />
			<section className={style.protocolInfo}>
				<p className={style.authorInfo}>
					<span className={style.authorName}>{authorName},</span>
					<span className={style.authorRole}>{authorRole}</span>
				</p>
				<p className={style.protocolData}>
					<span>{protocolData.date}</span>
					<span>|</span>
					<span>{protocolData.readTime}</span>
					<span>|</span>
					<span>{protocolData.visits}</span>
					<span>|</span>
					<span>{protocolData.replies}</span>
				</p>
			</section>
		</main>
	)
}

export default ProtocolAvatar
