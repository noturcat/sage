import ActivePingIndicator from '@/components/atoms/active-ping-indicator/ActivePingIndicator'
import Avatar from '@/components/atoms/avatar/Avatar'
import styles from './ChatItem.module.scss'
import { getTimeElapsed } from '@/util/globalFunction'
import { usePathname, useRouter } from 'next/navigation'

interface ChatItemProps {
	message: string
	date: string
	avatar: string
	name: string
	username: string
	isActive: boolean
	chatRoomId: string
	isMuted: boolean
}

function ChatItem({
	message,
	date,
	avatar,
	name,
	username,
	isActive,
	chatRoomId,
	isMuted,
}: ChatItemProps) {
	const router = useRouter()

	// Get filter type from the path
	const filterType = usePathname().split('/')[2] as 'all' | 'unread' | 'requests'

	const handleClick = () => {
		if (filterType === 'requests') {
			router.push(`/messages/requests/${chatRoomId}/pending`)
		} else {
			router.push(`/messages/${filterType}/${chatRoomId}`)
		}
	}

	return (
		<div className={styles.messageContainer} onClick={handleClick}>
			<div className={styles.messageItem}>
				<Avatar src={avatar} alt={name} size={40} extraClass={styles.messageItemAvatar} />

				<div className={styles.messageItemContent}>
					<div className={styles.topInfo}>
						<span className={styles.messageItemName}>{name}</span>
						<span className={styles.messageItemUsername}>@{username}</span>
						{isMuted && <span className={styles.muteIcon}></span>}
					</div>

					<div className={styles.botInfo}>
						<span className={styles.messageText}>{message}</span>
						<span className={styles.messageItemDate}>{getTimeElapsed(date, true)}</span>
					</div>
				</div>
			</div>

			{isActive && <ActivePingIndicator size="small" color="green" />}
		</div>
	)
}

export default ChatItem
