'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import CustomButton from '@/components/atoms/button/CustomButton'
import DiscoveryContentHeader from '@/components/molecules/cards/discovery-card/DiscoveryContentHeader'
import AboutTheAuthor, { Author } from '@/components/molecules/cards/discovery-card/AboutTheAuthor'
import RelatedDiscovery from '@/components/molecules/cards/discovery-card/RelatedDiscovery'
import Comments from '@/components/molecules/comments/Comments'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'
import NoDataCard from '@/components/molecules/cards/no-data-card/NoDataCard'
import ErrorCard from '@/components/molecules/cards/error-card/ErrorCard'
import { useGetOneDiscover } from '@/app/api/discoveries/queries/one-discover'
import { useGetComments } from '@/app/api/comments/queries/comments'
import { CommentableTypeEnum } from '@/types/Enums'

import style from './OneDiscoveryPage.module.scss'

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
 * <OneDiscoveryPage />
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

function OneDiscoveryPage() {
	const router = useRouter()
	const params = useParams<{ slug: string }>()
	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const { data: oneDiscoveryData, isPending, error } = useGetOneDiscover(id ?? '')
	const { data: commentsData, isPending: isCommentsPending } = useGetComments(
		Number(id),
		CommentableTypeEnum.DISCOVERY
	)

	useEffect(() => {
		if (!isPending && oneDiscoveryData?.data) {
			const realId = String(oneDiscoveryData.data.id)
			const realSlug = oneDiscoveryData.data.attributes.slug

			if (realId !== id || realSlug !== params.slug) {
				router.replace(`/discover/${realSlug}?id=${realId}`)
			}
		}
	}, [isPending, oneDiscoveryData, id, params.slug, router])

	if (!id) {
		return <NoDataCard module="Discovery" />
	}

	const image = oneDiscoveryData?.data?.attributes?.featured_image
		? oneDiscoveryData?.data?.attributes?.featured_image?.url
		: '/images/jh-template-3.png'

	const commentsCount =
		(oneDiscoveryData?.data?.attributes?.comments_count ?? 0) +
		(oneDiscoveryData?.data?.attributes?.replies_count ?? 0)

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
					<DiscoveryContentHeader discovery={oneDiscoveryData?.data ?? null} loading={isPending} />
					<article className={style.discoveryContent}>
						<div className={style.imageContainer}>
							<>
								{isPending ? (
									<Skeleton className={style.imageSkeleton} />
								) : (
									<Image
										src={image}
										alt={oneDiscoveryData?.data?.attributes?.title ?? 'discovery image'}
										width={400}
										height={200}
										className={style.discoveryImage}
										priority
									/>
								)}
							</>
							{isPending ? (
								<Skeleton className={style.descriptionSkeleton} />
							) : (
								<p className={style.imageDescription}>
									{oneDiscoveryData?.data?.attributes?.title}
								</p>
							)}
						</div>
						<div className={style.data}>
							{isPending ? (
								<Skeleton className={style.contentSkeleton} />
							) : (
								<RichTextContent html={oneDiscoveryData?.data?.attributes?.content} />
							)}

							<p className={style.end}>- end of article - </p>
							<div className={style.buttons}>
								<CustomButton variant="secondary" radius="full" className={style.report}>
									<span className={style.iconReport} />
									Report
								</CustomButton>
								<CustomButton variant="secondary" radius="full" className={style.print}>
									<span className={style.iconPrint} />
									Print
								</CustomButton>
							</div>
							<div className={style.pagination}>
								<CustomButton variant="text" className={style.previous}>
									<span className={style.iconPrevious} />
									Previous
								</CustomButton>
								<CustomButton variant="text" className={style.next}>
									Next
									<span className={style.iconNext} />
								</CustomButton>
							</div>
							<AboutTheAuthor
								author={oneDiscoveryData?.data?.attributes.author ?? ({} as Author)}
								loading={isPending}
							/>
							{/* Add the comments section similar to OneThreadPage */}
							<div className={style.label}>
								<p>Comments ({commentsCount})</p>
							</div>
							<Comments
								comments={commentsData?.data ?? []}
								isLoading={isCommentsPending}
								commentableId={Number(id)}
								commentableType={CommentableTypeEnum.DISCOVERY}
							/>
							<RelatedDiscovery />
						</div>
					</article>
				</div>
			</section>
		</main>
	)
}

export default OneDiscoveryPage
