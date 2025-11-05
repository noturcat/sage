'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import { Select } from '@/components/atoms/form/select/Select'
import Comments from '@/components/molecules/comments/Comments'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'
import ThreadContentHeader from '@/components/molecules/cards/thread-card/ThreadContentHeader'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import NoDataCard from '@/components/molecules/cards/no-data-card/NoDataCard'
import ErrorCard from '@/components/molecules/cards/error-card/ErrorCard'
import { useGetOneThread } from '@/app/api/threads/queries/one-thread'
import { useGetComments } from '@/app/api/comments/queries/comments'
import { CommentableTypeEnum } from '@/types/Enums'

import style from './OneThreadPage.module.scss'

/**
 * **Comprehensive thread detail** and instruction display page.
 *
 * Detailed thread viewing page that presents complete thread information including
 * ingredients, mechanisms, timeline, instructions, and disclaimers. Features intuitive
 * navigation with back functionality and structured information cards for enhanced
 * readability and user experience.
 *
 * Example:
 * ```tsx
 * <OneThreadPage />
 * ```
 *
 * Notes:
 * - Complete thread information display with structured sections.
 * - Back navigation functionality with router integration.
 * - Author information and thread metadata presentation.
 * - Interactive thread actions with tags and subscription options.
 * - Thread content display with formatted text and engagement.
 * - Reply system with filtering and voting capabilities.
 * - Recommended topics sidebar for content discovery.
 * - Responsive layout with optimized information hierarchy.
 */

function OneThreadPage() {
	const router = useRouter()
	const params = useParams<{ slug: string }>()
	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const { data: oneThreadData, isPending, error } = useGetOneThread(id ?? '')
	const { data: commentsData, isPending: isCommentsPending } = useGetComments(
		Number(id),
		CommentableTypeEnum.THREAD
	)

	const commentsCount =
		(oneThreadData?.data?.attributes?.comments_count ?? 0) +
		(oneThreadData?.data?.attributes?.replies_count ?? 0)

	useEffect(() => {
		if (!isPending && oneThreadData?.data) {
			const realId = String(oneThreadData.data.id)
			const realSlug = oneThreadData.data.attributes.slug

			if (realId !== id || realSlug !== params.slug) {
				router.replace(`/threads/${realSlug}?id=${realId}`)
			}
		}
	}, [isPending, oneThreadData, id, params.slug, router])

	if (!id) {
		return <NoDataCard module="Thread" />
	}

	const handleBack = () => {
		router.back()
	}

	if (error) {
		return <ErrorCard error={error.message} />
	}

	return (
		<main className={style.wrapper}>
			<section className={style.container}>
				<CustomButton size="icon" className={style.backButton} radius="full" onClick={handleBack}>
					<span className={style.iconBack} />
				</CustomButton>
				<div className={style.content}>
					<div className={style.threadInfo}>
						<ThreadContentHeader thread={oneThreadData?.data ?? null} loading={isPending} />
						{isPending ? (
							<Skeleton className={style.skeleton} />
						) : (
							<article className={style.threadContent}>
								<RichTextContent
									html={oneThreadData?.data?.attributes.content as Record<string, string>[]}
								/>
							</article>
						)}

						<div className={style.repliesHeader}>
							<p className={style.repliesLabel}>REPLIES ({commentsCount})</p>
							<Select options={[]} placeholder="Filter" radius="full" />
						</div>
						<div className={style.repliesContainer}>
							<Comments
								comments={commentsData?.data ?? []}
								isLoading={isCommentsPending}
								commentableId={Number(id)}
								commentableType={CommentableTypeEnum.THREAD}
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default OneThreadPage
