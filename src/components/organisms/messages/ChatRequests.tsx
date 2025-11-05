'use client'

import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import ChatItem from '@/components/molecules/messages/ChatItem'
import { mockRequestData } from './mock-data'
import EmptyInbox from './EmptyInbox'
import styles from './ChatRequests.module.scss'

function ChatRoom() {
	const router = useRouter()

	const handleBackClick = () => {
		router.push('/messages')
	}

	const messageData = mockRequestData

	return (
		<section className={styles.chatRoomContainer}>
			<div className={styles.messageRequestsHeader}>
				<h1 className={styles.title}>
					<CustomButton onClick={handleBackClick} variant="text" className={styles.iconBackButton}>
						<span className={styles.iconBack} />
					</CustomButton>
					Messages Requests
				</h1>
			</div>

			<span className={styles.messageRequestsDescription}>
				These messages are from the people you don&apos;t follow. They&apos;ll only know that
				you&apos;ve seen their request if you choose Accept.
			</span>

			<div className={styles.horizontalSeparator}></div>

			{/* Message List */}
			<div className={styles.messageListContainer}>
				{messageData.length > 0 ? (
					messageData.map((chat, index) => (
						<ChatItem
							key={`${chat.username}-${index}`}
							message={chat.message}
							date={chat.date}
							avatar={chat.avatar}
							name={chat.name}
							username={chat.username}
							isActive={chat.isActive}
							chatRoomId={chat.chatRoomId}
							isMuted={chat.isMuted}
						/>
					))
				) : (
					<EmptyInbox message="No messages requests" description="You have no messages requests" />
				)}
			</div>
		</section>
	)
}

export default ChatRoom
