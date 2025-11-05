import CustomButton from '@/components/atoms/button/CustomButton'
import Votes from '@/components/molecules/votes/Votes'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { VoteTypeEnum, VoteableTypeEnum } from '@/types/Enums'

import style from './ProtocolActions.module.scss'

/**
 * **Interactive action bar** with tags and protocol controls.
 *
 * Comprehensive action component that displays protocol tags and provides essential
 * interaction controls. Features intelligent tag display with overflow handling and subscription management.
 *
 * Example:
 * ```tsx
 * <ProtocolActions tags={tags} />
 * ```
 *
 * Notes:
 * - Smart tag display showing first 2 tags with ellipsis for overflow.
 * - Interactive subscription button with notification bell icon.
 * - Quote and print action buttons for content sharing and documentation.
 * - Responsive button layout with consistent styling and spacing.
 * - Full border radius design for modern, pill-shaped appearance.
 */

interface ProtocolActionsProps {
	tags: string[]
	voteableId?: number
	votes?: number
	userVote?: VoteTypeEnum | null
	loading?: boolean
}

function ProtocolActions({
	tags,
	voteableId = 0,
	votes = 0,
	userVote = null,
	loading = false,
}: ProtocolActionsProps) {
	return (
		<main className={style.actions}>
			<div className={style.tags}>
				{loading ? (
					<>
						<Skeleton className={style.tagSkeleton} />
						<Skeleton className={style.tagSkeleton} />
					</>
				) : (
					tags.slice(0, 2).map(tag => (
						<CustomButton key={tag} variant="outline" radius="full" className={style.tag}>
							#{tag}
						</CustomButton>
					))
				)}
				{!loading && tags.length > 2 && (
					<CustomButton variant="outline" size="icon" radius="full" className={style.tag}>
						<span className={style.iconEllipsis} />
					</CustomButton>
				)}
			</div>
			<div className={style.actionButtons}>
				<Votes
					voteableId={voteableId}
					voteableType={VoteableTypeEnum.PROTOCOL}
					votes={votes}
					userVote={userVote}
					validationKey="one-protocol"
					pending={loading}
				/>
				<CustomButton variant="secondary" radius="full" className={style.subscribe}>
					<span className={style.iconBell} />
					Subscribe
				</CustomButton>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.quote}>
					<span className={style.iconQuote} />
				</CustomButton>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.print}>
					<span className={style.iconPrint} />
				</CustomButton>
			</div>
		</main>
	)
}

export default ProtocolActions
