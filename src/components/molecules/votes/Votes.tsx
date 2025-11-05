'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useAddVote } from '@/app/api/votes/mutations/add-vote'
import { VoteTypeEnum, VoteableTypeEnum } from '@/types/Enums'

import style from './Votes.module.scss'

interface Votes {
	voteableId: number
	voteableType: VoteableTypeEnum
	votes: number
	validationKey?: string
	pending?: boolean
	userVote: VoteTypeEnum | null
}

function Votes({
	voteableId,
	voteableType,
	votes,
	validationKey,
	pending = false,
	userVote,
}: Votes) {
	const queryClient = useQueryClient()
	const { mutateAsync: addVote, isPending } = useAddVote(() => {
		queryClient.invalidateQueries({ queryKey: [validationKey] })
	})

	const handleAddVote = async (voteType: VoteTypeEnum) => {
		try {
			await addVote({
				vote: {
					voteable_id: voteableId,
					voteable_type: voteableType,
					vote_type: voteType,
				},
			})
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className={style.votes}>
			<button
				className={style.upvote}
				data-is-upvoted={userVote === VoteTypeEnum.UPVOTE}
				onClick={() => handleAddVote(VoteTypeEnum.UPVOTE)}
				disabled={isPending || pending}
			>
				<span className={style.iconUpvote} />
			</button>
			{isPending || pending ? (
				<span className={style.loader} />
			) : (
				<p className={style.count}>{votes}</p>
			)}
			<button
				className={style.downvote}
				data-is-downvoted={userVote === VoteTypeEnum.DOWNVOTE}
				onClick={() => handleAddVote(VoteTypeEnum.DOWNVOTE)}
				disabled={isPending || pending}
			>
				<span className={style.iconDownvote} />
			</button>
		</div>
	)
}

export default Votes
