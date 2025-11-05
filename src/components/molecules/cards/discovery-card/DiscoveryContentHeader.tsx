import ContentHeader from '@/components/molecules/cards/content-header-card/ContentHeader'
import DiscoveryActions from '@/components/molecules/item-group/DiscoveryActions'
import InnerContentAvatar from '@/components/molecules/avatar-group/InnerContentAvatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { DiscoverType } from '@/types/Discover.type'

import style from './DiscoveryContentHeader.module.scss'

/**
 * **Discovery content header** with comprehensive information display.
 *
 * Discovery-specific implementation of ContentHeader that displays category, title, author details,
 * engagement metrics, and interactive elements. Optimized for discovery viewing pages.
 *
 * Example:
 * ```tsx
 * <DiscoveryContentHeader
 *   title="Try This: Desk Stretch Routine for Remote Workers"
 *   category="Regenerative Farming"
 *   avatar="/images/author.jpg"
 *   name="Xich Atibagos"
 *   role="regenerative farming practitioner"
 *   discoveryData={{
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
 * - Discovery analytics including date, read time, visits, and replies.
 * - Smart tag display with overflow handling.
 * - Integration with ContentHeader compound component system.
 */

interface DiscoveryContentHeaderProps {
	discovery: DiscoverType | null
	loading?: boolean
}

function DiscoveryContentHeader({ discovery, loading = false }: DiscoveryContentHeaderProps) {
	return (
		<ContentHeader>
			<ContentHeader.Title>
				{loading ? (
					<Skeleton className={style.titleSkeleton} />
				) : (
					<span>{discovery?.attributes?.title}</span>
				)}
				<CustomButton variant="text" size="icon" radius="full">
					<span className={style.iconSave} />
				</CustomButton>
			</ContentHeader.Title>
			<ContentHeader.ContentInfo>
				<DiscoveryActions
					tags={discovery?.attributes?.tags ?? []}
					loading={loading}
					voteableId={discovery?.id ?? 0}
					votes={discovery?.attributes?.votes_score ?? 0}
					userVote={discovery?.attributes?.user_vote ?? null}
				/>
			</ContentHeader.ContentInfo>
			<ContentHeader.Footer>
				<InnerContentAvatar
					variant="discovery"
					category={discovery?.attributes?.primary_category?.name ?? ''}
					name={
						discovery?.attributes?.author?.first_name +
						' ' +
						discovery?.attributes?.author?.last_name
					}
					role={discovery?.attributes?.author?.bio ?? ''}
					avatar={'/images/avatar-placeholder.png'}
					date={discovery?.attributes?.created_at ?? ''}
					readTime={discovery?.attributes?.average_reading_time ?? ''}
					visits="0 Visits"
					replies={`${discovery?.attributes?.replies_count?.toString() ?? '0'} Replies`}
					loading={loading}
				/>
			</ContentHeader.Footer>
		</ContentHeader>
	)
}

export default DiscoveryContentHeader
