import { useState, useRef, useEffect } from 'react'
import Avatar from '@/components/atoms/avatar/Avatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './ReplyCard.module.scss'

/**
 * **Reply card** for thread discussions.
 *
 * Displays user comments with author info, voting system, and content truncation.
 * Features automatic height detection with expand/collapse functionality.
 *
 * Example:
 * ```tsx
 * <ReplyCard
 *   avatar="/images/user1.jpg"
 *   authorName="John Doe"
 *   time="2 minutes ago"
 *   replyCount={1}
 *   votes={15}
 *   content="This is a great point! I completely agree with your analysis."
 * />
 * ```
 *
 * Notes:
 * - Author section with avatar, name, timestamp, and reply number.
 * - Interactive voting system with upvote/downvote buttons.
 * - Smart content truncation with automatic height detection.
 * - Expand/collapse functionality for long content.
 * - Quote button for referencing specific replies.
 */

interface ReplyCardProps {
	avatar: string
	author: string
	time: string
	count: number
	votes: number
	content: string
}

function ReplyCard({ avatar, author, time, count, votes, content }: ReplyCardProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [needsTruncation, setNeedsTruncation] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (contentRef.current) {
			const { scrollHeight, clientHeight } = contentRef.current
			setNeedsTruncation(scrollHeight > clientHeight)
		}
	}, [content])

	return (
		<article className={style.card}>
			<header className={style.header}>
				<section className={style.replyInfo}>
					<Avatar src={avatar} alt={author} size={32} />
					<div className={style.replyInfoContent}>
						<p className={style.replyInfoName}>{author}</p>
						<p className={style.replyInfoDate}>
							<span>{time}</span>
							<span>|</span>
							<span>#{count}</span>
						</p>
					</div>
				</section>
				<section className={style.replyActions}>
					<div className={style.voteAction}>
						<p className={style.voteCount}>{votes} votes</p>
						<div className={style.voteButtons}>
							<div className={style.voteButton}>
								<span className={style.iconUpvote} />
							</div>
							<div className={style.voteButton}>
								<span className={style.iconDownvote} />
							</div>
						</div>
					</div>
					<CustomButton variant="secondary" size="icon" radius="full" className={style.quoteButton}>
						<span className={style.iconQuote} />
					</CustomButton>
				</section>
			</header>
			<main className={style.contentWrapper}>
				<div
					ref={contentRef}
					className={`${style.content} ${isExpanded ? style.contentExpanded : ''}`}
				>
					{content}
				</div>
				{needsTruncation && (
					<CustomButton
						variant="text"
						className={style.toggleButton}
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? 'See less' : 'See more'}
					</CustomButton>
				)}
			</main>
		</article>
	)
}

export default ReplyCard
