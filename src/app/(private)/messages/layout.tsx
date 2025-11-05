'use client'

import { ReactNode } from 'react'
import ChatRoom from '@/components/organisms/messages/ChatRoom'
import styles from './layout.module.scss'
import { usePathname } from 'next/navigation'
import ChatRequests from '@/components/organisms/messages/ChatRequests'

function MessageLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const isRequestsPage = pathname.includes('/messages/requests')

	// Check if pathname contains a chatRoomId (e.g., /messages/all/[chatRoomId] or /messages/requests/[chatRoomId])
	const hasChatRoom = /\/messages\/(all|requests|unread)\/[^/]+/.test(pathname)

	// Determine which sidebar to show
	const SidebarComponent = isRequestsPage ? ChatRequests : ChatRoom

	return (
		<main className={styles.container}>
			<div className={`${styles.chatRoomContainer} ${hasChatRoom ? styles.hideOnMobile : ''}`}>
				<SidebarComponent />
			</div>
			<div className={`${styles.childrenContainer} ${!hasChatRoom ? styles.hideOnMobile : ''}`}>
				{children}
			</div>
		</main>
	)
}

export default MessageLayout
