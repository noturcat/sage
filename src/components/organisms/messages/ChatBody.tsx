'use client'

import ChatMessages from '@/components/molecules/messages/ChatMessages'
import styles from './ChatBody.module.scss'
import ChatHeader from '@/components/molecules/messages/ChatHeader'
import { useParams, usePathname } from 'next/navigation'
import ChatInput from '@/components/atoms/rich-text-editor/chat-editor/ChatInput'
import NoChatSelected from './NoChatSelected'

function ChatBody() {
	// Check if the url has a chatRoomId
	const { chatRoomId } = useParams()

	const pathname = usePathname()
	const type = pathname.includes('requests') ? 'request' : 'chat'

	return (
		<section className={styles.chatBodyContainer}>
			<div className={styles.chatHeaderContainer}>{chatRoomId && <ChatHeader />}</div>

			{type === 'request' && !chatRoomId && <NoChatSelected type={type} buttonLabel="" />}
			{type === 'request' && chatRoomId && (
				<>
					<div className={styles.chatMessagesContainer}>
						<ChatMessages />
					</div>
				</>
			)}

			{type === 'chat' && !chatRoomId && (
				<NoChatSelected
					type={type}
					buttonLabel={type === 'chat' ? 'New Chat' : ''}
					dialogTitle="New Message"
				/>
			)}

			{type === 'chat' && chatRoomId && (
				<>
					<div className={styles.chatMessagesContainer}>
						<ChatMessages />
					</div>
					<div className={styles.chatInputContainer}>
						<ChatInput />
					</div>
				</>
			)}
		</section>
	)
}

export default ChatBody
