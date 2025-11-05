import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import ContentHeader from '@/components/molecules/cards/content-header-card/ContentHeader'
import ProtocolActions from '@/components/molecules/item-group/ProtocolActions'
import InnerContentAvatar from '@/components/molecules/avatar-group/InnerContentAvatar'
import { ProtocolType } from '@/types/Protocol.type'

import style from './ProtocolContentHeader.module.scss'

/**
 * **Protocol-specific content header** with comprehensive information display.
 *
 * Thread-specific implementation of ContentHeader that displays category, title, author details,
 * engagement metrics, and interactive elements. Optimized for protocol viewing pages.
 *
 * Example:
 * ```tsx
 * <ProtocolContentHeader
 *   title="Try This: Desk Stretch Routine for Remote Workers"
 *   category="Regenerative Farming"
 *   avatar="/images/author.jpg"
 *   authorName="Xich Atibagos"
 *   authorRole="regenerative farming practitioner"
 *   protocolData={{
 *     date: "Thursday, 23 January 2025",
 *     readTime: "15 min read",
 *     visits: "39 Visits",
 *     replies: "5 Replies"
 *   }}
 *   tags={{ tags: ["Remedies", "Herbal", "Wellness"] }}
 * />
 * ```
 *
 * Notes:
 * - Category button with arrow icon for navigation context.
 * - Author information with avatar, name, and professional role.
 * - Protocol analytics including date, read time, visits, and replies.
 * - Smart tag display with overflow handling.
 * - Integration with ContentHeader compound component system.
 */

interface ProtocolContentHeaderProps {
	protocol: ProtocolType | null
	loading?: boolean
}

function ProtocolContentHeader({ protocol, loading = false }: ProtocolContentHeaderProps) {
	return (
		<ContentHeader>
			{loading ? (
				<Skeleton className={style.buttonSkeleton} />
			) : (
				<button className={style.button}>
					{protocol?.attributes?.category?.name ?? ''}
					<span className={style.iconArrowSlant} />
				</button>
			)}

			<ContentHeader.Title>
				{loading ? (
					<Skeleton className={style.titleSkeleton} />
				) : (
					<span>{protocol?.attributes?.title}</span>
				)}
				<CustomButton variant="text" size="icon" radius="full">
					<span className={style.iconSave} />
				</CustomButton>
			</ContentHeader.Title>
			<ContentHeader.ContentInfo>
				<InnerContentAvatar
					category={protocol?.attributes?.category?.name ?? ''}
					name={
						protocol?.attributes?.author?.first_name + ' ' + protocol?.attributes?.author?.last_name
					}
					role={protocol?.attributes?.author?.bio ?? ''}
					avatar={'/images/avatar-placeholder.png'}
					date={protocol?.attributes?.created_at ?? ''}
					readTime={protocol?.attributes?.average_reading_time ?? ''}
					visits="0 Visits"
					replies={`${protocol?.attributes?.replies_count?.toString() ?? '0'} Replies`}
					loading={loading}
				/>
			</ContentHeader.ContentInfo>
			<ContentHeader.Footer>
				<ProtocolActions
					tags={protocol?.attributes?.tags ?? []}
					loading={loading}
					voteableId={Number(protocol?.id)}
					votes={protocol?.attributes?.votes_score ?? 0}
					userVote={protocol?.attributes?.user_vote ?? null}
				/>
			</ContentHeader.Footer>
		</ContentHeader>
	)
}

export default ProtocolContentHeader
