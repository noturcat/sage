'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/atoms/input/Input'
import CustomButton from '@/components/atoms/button/CustomButton'
import ChatItem from '@/components/molecules/messages/ChatItem'
import EmptyInbox from './EmptyInbox'
import ChatRequestPrompt from '@/components/molecules/messages/ChatRequestPrompt'
import { useGetChatRooms } from '@/app/api/messages/queries/chat-rooms'
import type { ChatRoomType } from '@/types/ChatRoom.type'
import useUserStore from '@/store/UserStore'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ChatRoom.module.scss'

function ChatRoom() {
	const router = useRouter()
	const user = useUserStore(state => state.user)
	const [searchQuery, setSearchQuery] = useState('')
	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	const handleFilterClick = (filter: 'all' | 'unread' | 'requests') => {
		router.push(`/messages/${filter}`)
	}

	// get the first segment of the path
	const currentFilter = usePathname().split('/')[2] || 'all'

	const queryType = currentFilter === 'requests' ? 'requests' : 'all'
	const { data: chatRooms, isLoading, error } = useGetChatRooms(queryType, debouncedSearchQuery)

	const mapChatRoomToMessageData = (chatRoom: ChatRoomType) => {
		const users = chatRoom.attributes.users as ChatRoomType['attributes']['users']
		const messages = chatRoom.attributes.messages as ChatRoomType['attributes']['messages']

		// Get current user ID
		const currentUserId = user?.id

		// Find the other user
		const otherUser = Array.isArray(users)
			? users.find(u => u.id !== currentUserId) || users[0]
			: null

		const latestMessage = Array.isArray(messages) && messages.length > 0 ? messages[0] : null

		const fullName = otherUser
			? `${otherUser.first_name} ${otherUser.last_name}`.trim()
			: 'Unknown User'

		const username = otherUser?.username || 'unknown'

		// Placeholder
		const avatar = '/images/avatar-placeholder.png'

		const message = latestMessage?.attributes?.message || 'No messages yet'
		const date =
			latestMessage?.attributes?.updated_at ||
			chatRoom.attributes.updated_at ||
			chatRoom.attributes.created_at ||
			new Date().toISOString()

		return {
			message,
			date,
			time: new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
			avatar,
			name: fullName,
			username,
			isActive: false,
			chatRoomId: chatRoom.id,
			isMuted: false,
		}
	}

	const messageData = chatRooms ? chatRooms.map(mapChatRoomToMessageData) : []

	return (
		<section className={styles.chatRoomContainer}>
			<h1 className={styles.title}>Messages</h1>

			{/* Search Input */}
			<Input
				id="search-dm"
				name="search-dm"
				type="search"
				placeholder="Search Direct Messages"
				radius="full"
				className={styles.searchInput}
				rightIcon={<span className={styles.iconCreate} />}
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
			/>

			{/* Filter Container */}
			<div className={styles.filterContainer}>
				<div className={styles.filterButtons}>
					<CustomButton
						radius="full"
						className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
						onClick={() => handleFilterClick('all')}
					>
						All
					</CustomButton>
					<CustomButton
						radius="full"
						className={`${styles.filterButton} ${currentFilter === 'unread' ? styles.active : ''}`}
						onClick={() => handleFilterClick('unread')}
					>
						Unread
					</CustomButton>
				</div>

				<div className={styles.requestBlockContainer}>
					<span className={styles.requestsButton} onClick={() => handleFilterClick('requests')}>
						Requests
					</span>
					<span className={styles.requestsButton}>Blocked</span>
				</div>
			</div>

			{/* Message List */}
			<div className={styles.messageListContainer}>
				<ChatRequestPrompt />

				{isLoading ? (
					<div className={styles.skeletonList}>
						{Array.from({ length: 7 }).map((_, index) => (
							<div key={index} className={styles.skeletonItem}>
								<Skeleton radius="full" className={styles.skeletonAvatar} />
								<div className={styles.skeletonTextContainer}>
									<Skeleton radius="md" className={styles.skeletonName} />
									<Skeleton radius="md" className={styles.skeletonMessage} />
								</div>
							</div>
						))}
					</div>
				) : error ? (
					<div className={styles.errorContainer}>
						<p>Failed to load chat rooms. Please try again.</p>
					</div>
				) : messageData.length > 0 ? (
					messageData.map(chat => (
						<ChatItem
							key={chat.chatRoomId}
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
					<EmptyInbox />
				)}
			</div>
		</section>
	)
}

export default ChatRoom
