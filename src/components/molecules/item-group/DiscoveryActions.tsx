import CustomButton from '@/components/atoms/button/CustomButton'
import Votes from '@/components/molecules/votes/Votes'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { VoteTypeEnum, VoteableTypeEnum } from '@/types/Enums'

import style from './DiscoveryActions.module.scss'

/**
 * **Interactive action bar** with tags and discovery controls.
 *
 * Comprehensive action component that displays thread tags and provides essential
 * interaction controls. Features intelligent tag display with overflow handling and subscription management.
 *
 * Example:
 * ```tsx
 * <DiscoveryActions tags={tags} />
 * ```
 *
 * Notes:
 * - Smart tag display showing first 2 tags with ellipsis for overflow.
 * - Interactive subscription button with notification bell icon.
 * - Quote and print action buttons for content sharing and documentation.
 * - Responsive button layout with consistent styling and spacing.
 * - Full border radius design for modern, pill-shaped appearance.
 */

interface DiscoveryActionsProps {
	tags: string[]
	loading?: boolean
	votes?: number
	voteableId?: number
	userVote?: VoteTypeEnum | null
}

function DiscoveryActions({
	tags,
	loading = false,
	votes = 0,
	voteableId = 0,
	userVote = null,
}: DiscoveryActionsProps) {
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
							{tag}
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
					voteableType={VoteableTypeEnum.DISCOVERY}
					votes={votes ?? 0}
					userVote={userVote ?? null}
					validationKey="one-discovery"
					pending={loading}
				/>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.button}>
					<span className={style.iconFacebook} />
				</CustomButton>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.button}>
					<span className={style.iconX} />
				</CustomButton>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.button}>
					<span className={style.iconLinkedIn} />
				</CustomButton>
				<CustomButton variant="secondary" size="icon" radius="full" className={style.button}>
					<span className={style.iconPinterest} />
				</CustomButton>
			</div>
		</main>
	)
}

export default DiscoveryActions
