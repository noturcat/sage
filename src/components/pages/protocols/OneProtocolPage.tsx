'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import ProtocolContentHeader from '@/components/molecules/cards/protocol-card/ProtocolContentHeader'
import NoDataCard from '@/components/molecules/cards/no-data-card/NoDataCard'
import ErrorCard from '@/components/molecules/cards/error-card/ErrorCard'
import { ProtocolInfoCard } from '@/components/molecules/cards/protocol-card/ProtocolInfoCard'
import { FAQsCard } from '@/components/molecules/cards/protocol-card/FAQsCard'
import { SourceCard } from '@/components/molecules/cards/protocol-card/SourceCard'
import { useGetOneProtocol } from '@/app/api/protocols/queries/one-protocol'
import { useGetComments } from '@/app/api/comments/queries/comments'
import { CommentableTypeEnum } from '@/types/Enums'
import { Select } from '@/components/atoms/form/select/Select'
import Comments from '@/components/molecules/comments/Comments'

import style from './OneProtocolPage.module.scss'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'

/**
 * **Comprehensive protocol detail** and instruction display page.
 *
 * Detailed protocol viewing page that presents complete protocol information including
 * ingredients, mechanisms, timeline, instructions, and disclaimers. Features intuitive
 * navigation with back functionality and structured information cards for enhanced
 * readability and user experience.
 *
 * Example:
 * ```tsx
 * <OneProtocolPage />
 * ```
 *
 * Notes:
 * - Complete protocol information display with structured sections.
 * - Back navigation functionality with router integration.
 * - Author information and protocol metadata presentation.
 * - Interactive protocol actions with tags and subscription options.
 * - Ingredient and tool listings with clear formatting.
 * - Step-by-step instruction display with ordered lists.
 * - Timeline and duration information for protocol planning.
 * - Optional notes and disclaimers with italic emphasis.
 * - Recommended topics sidebar for content discovery.
 */

function OneProtocolPage() {
	const router = useRouter()
	const params = useParams<{ slug: string }>()
	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const { data: oneProtocolData, isPending, error } = useGetOneProtocol(id ?? '')
	const { data: commentsData, isPending: isCommentsPending } = useGetComments(
		Number(id),
		CommentableTypeEnum.PROTOCOL
	)

	const commentsCount =
		(oneProtocolData?.data?.attributes?.comments_count ?? 0) +
		(oneProtocolData?.data?.attributes?.replies_count ?? 0)

	useEffect(() => {
		if (!isPending && oneProtocolData?.data) {
			const realId = String(oneProtocolData.data.id)
			const realSlug = oneProtocolData.data.attributes.slug

			if (realId !== id || realSlug !== params.slug) {
				router.replace(`/protocols/${realSlug}?id=${realId}`)
			}
		}
	}, [isPending, oneProtocolData, id, params.slug, router])

	if (!id) {
		return <NoDataCard module="Protocol" />
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
					<div className={style.protocolInfo}>
						<ProtocolContentHeader protocol={oneProtocolData?.data ?? null} loading={isPending} />
						<ProtocolInfoCard label="INGREDIENTS / TOOLS" loading={isPending}>
							<RichTextContent html={oneProtocolData?.data?.attributes.ingredients} />
						</ProtocolInfoCard>
						<ProtocolInfoCard label="MECHANISM" loading={isPending}>
							<RichTextContent html={oneProtocolData?.data?.attributes.mechanism} />
						</ProtocolInfoCard>
						<ProtocolInfoCard label="TIMELINE / DURATION" loading={isPending}>
							<RichTextContent html={oneProtocolData?.data?.attributes.timeline} />
						</ProtocolInfoCard>

						<ProtocolInfoCard label="HOW TO FOLLOW (INSTRUCTION)" loading={isPending}>
							<RichTextContent html={oneProtocolData?.data?.attributes.instructions} />
						</ProtocolInfoCard>

						<div className={style.faqsContainer}>
							<p className={style.faqsLabel}>FAQs</p>
							{oneProtocolData?.data?.attributes?.faqs?.map(faq => (
								<FAQsCard
									key={faq.id}
									faqs={{ id: faq.id, question: faq.question, answer: faq.answer }}
								/>
							))}
						</div>
						{oneProtocolData?.data?.attributes.disclaimer && (
							<ProtocolInfoCard label="OPTIONAL NOTES / DISCLAIMER" loading={isPending}>
								<RichTextContent html={oneProtocolData?.data?.attributes.disclaimer} />
							</ProtocolInfoCard>
						)}
						<div className={style.sourcesContainer}>
							<p className={style.sourcesLabel}>SOURCES</p>
							{oneProtocolData?.data?.attributes?.sources?.map(source => (
								<SourceCard key={source.id} count={source.id} source={source.link ?? ''} />
							))}
						</div>
						<div className={style.commentsHeader}>
							<p className={style.commentsLabel}>COMMENTS ({commentsCount})</p>
							<Select options={[]} placeholder="Filter" radius="full" />
						</div>
						<div className={style.commentsContainer}>
							<Comments
								comments={commentsData?.data ?? []}
								isLoading={isCommentsPending}
								commentableId={Number(id)}
								commentableType={CommentableTypeEnum.PROTOCOL}
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default OneProtocolPage
