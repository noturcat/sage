'use client'

import { useParams } from 'next/navigation'
import ChatMessages from '@/components/molecules/messages/ChatMessages'
import ChatHeader from '@/components/molecules/messages/ChatHeader'
import styles from './MessageRequestPage.module.scss'
import ChatInput from '@/components/atoms/rich-text-editor/chat-editor/ChatInput'

function MessageRequestPage() {
	// Check if the url has a chatRoomId
	const { chatRoomId } = useParams()

	return (
		<section className={styles.chatBodyContainer}>
			{chatRoomId && <ChatHeader />}
			<ChatMessages />
			<ChatInput />
		</section>
	)
}

export default MessageRequestPage
