import ContentHeader from '@/components/molecules/cards/content-header-card/ContentHeader'
import ThreadActions from '@/components/molecules/item-group/ThreadActions'
import InnerContentAvatar from '@/components/molecules/avatar-group/InnerContentAvatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { ThreadType } from '@/types/Thread.type'

import style from './ThreadContentHeader.module.scss'

/**
 * **Thread content header** with comprehensive information display.
 *
 * Thread-specific implementation of ContentHeader that displays category, title, author details,
 * engagement metrics, and interactive elements. Optimized for thread viewing pages.
 *
 * Example:
 * ```tsx
 * <ThreadContentHeader
 *   title="Try This: Desk Stretch Routine for Remote Workers"
 *   category="Regenerative Farming"
 *   avatar="/images/author.jpg"
 *   name="Xich Atibagos"
 *   role="regenerative farming practitioner"
 *   threadData={{
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
 * - Thread analytics including date, read time, visits, and replies.
 * - Smart tag display with overflow handling.
 * - Integration with ContentHeader compound component system.
 */

interface ThreadContentHeaderProps {
	thread: ThreadType | null
	loading?: boolean
}

function ThreadContentHeader({ thread, loading = false }: ThreadContentHeaderProps) {
	return (
		<ContentHeader>
			<ContentHeader.Title>
				{loading ? (
					<Skeleton className={style.titleSkeleton} />
				) : (
					<span>{thread?.attributes?.title}</span>
				)}
				<CustomButton variant="text" size="icon" radius="full">
					<span className={style.iconSave} />
				</CustomButton>
			</ContentHeader.Title>
			<ContentHeader.ContentInfo>
				<InnerContentAvatar
					variant="thread"
					category={thread?.attributes?.category?.name ?? ''}
					name={
						thread?.attributes?.author?.first_name + ' ' + thread?.attributes?.author?.last_name
					}
					role={thread?.attributes?.author?.bio ?? ''}
					avatar={'/images/avatar-placeholder.png'}
					date={thread?.attributes?.created_at ?? ''}
					readTime={thread?.attributes?.average_reading_time ?? ''}
					visits="0 Visits"
					replies={`${thread?.attributes?.replies_count?.toString() ?? '0'} Replies`}
					loading={loading}
				/>
			</ContentHeader.ContentInfo>
			<ContentHeader.Footer>
				<ThreadActions
					tags={thread?.attributes?.tags ?? []}
					loading={loading}
					voteableId={thread?.id ?? 0}
					votes={thread?.attributes?.votes_score ?? 0}
					userVote={thread?.attributes?.user_vote ?? null}
				/>
			</ContentHeader.Footer>
		</ContentHeader>
	)
}

export default ThreadContentHeader
