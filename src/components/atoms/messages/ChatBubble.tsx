import { useState } from 'react'
import Avatar from '../avatar/Avatar'
import styles from './ChatBubble.module.scss'

interface ChatBubbleProps {
	variant: 'left' | 'right'
	content: string
	avatar?: string
	isFirstInGroup?: boolean
	isLastInGroup?: boolean
	timestamp?: string
}

function ChatBubble({
	variant,
	content,
	avatar,
	isFirstInGroup = false,
	isLastInGroup = false,
	timestamp,
}: ChatBubbleProps) {
	const [showTimestamp, setShowTimestamp] = useState(false)

	const handleBubbleClick = () => {
		if (timestamp) {
			setShowTimestamp(!showTimestamp)
		}
	}
	if (variant === 'left') {
		return (
			<div className={styles.chatBubbleLeftContainer}>
				{avatar && (
					<Avatar
						src={avatar}
						alt="Avatar"
						size={40}
						extraClass={`${styles.messageItemAvatar} ${!isLastInGroup ? styles.hiddenAvatar : ''}`}
					/>
				)}
				<div className={styles.messageContainer}>
					<div
						className={`${styles.chatBubbleLeft} ${isFirstInGroup ? styles.firstInGroup : ''} ${isLastInGroup ? styles.lastInGroup : ''}`}
						onClick={handleBubbleClick}
					>
						{content}
					</div>
					{showTimestamp && timestamp && <div className={styles.timestamp}>{timestamp}</div>}
				</div>
			</div>
		)
	}

	if (variant === 'right') {
		return (
			<div className={styles.messageContainer}>
				<div
					className={`${styles.chatBubbleRight} ${isFirstInGroup ? styles.firstInGroup : ''} ${isLastInGroup ? styles.lastInGroup : ''}`}
					onClick={handleBubbleClick}
				>
					{content}
				</div>
				{showTimestamp && timestamp && <div className={styles.timestamp}>{timestamp}</div>}
			</div>
		)
	}

	return null
}

export default ChatBubble
