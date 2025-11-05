import { useMemo, useRef, useEffect, useCallback } from 'react'
import { useParams, usePathname } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component'
import { mockMessages, requestMessages } from './mock-data'
import ChatBubble from '@/components/atoms/messages/ChatBubble'
import CustomButton from '@/components/atoms/button/CustomButton'
import Separator from '@/components/atoms/separator/Separator'
import { useGetChatMessages } from '@/app/api/messages/queries/chat-messages'
import useUserStore from '@/store/UserStore'
import type { ChatRoomMessageType } from '@/types/ChatRoom.type'
import styles from './ChatMessages.module.scss'

function ChatMessages() {
	// Get messages data from the url
	const { chatRoomId } = useParams()
	const user = useUserStore(state => state.user)
	const messagesContainerRef = useRef<HTMLDivElement>(null)
	const hasInitialScrolled = useRef(false)

	const pathname = usePathname()
	const type = pathname.includes('requests') ? 'request' : 'chat'
	const {
		data: messagesData,
		isLoading: isLoadingMessages,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error: messagesError,
	} = useGetChatMessages(chatRoomId as string | undefined)

	const apiMessages = useMemo(() => {
		if (!messagesData?.pages) return []
		return messagesData.pages.flatMap(page => page.data)
	}, [messagesData])

	const messages = useMemo(() => {
		if (apiMessages && apiMessages.length > 0 && chatRoomId) {
			const currentUserId = user?.id
			const avatarPlaceholder = '/images/avatar-placeholder.png'
			const mappedMessages = apiMessages.map((msg: ChatRoomMessageType) => {
				const senderId = msg.attributes.sender.id
				const isCurrentUser = String(senderId) === String(currentUserId)
				const timestamp = new Date(msg.attributes.created_at).toLocaleTimeString('en-US', {
					hour: '2-digit',
					minute: '2-digit',
				})
				return {
					id: String(msg.id),
					variant: isCurrentUser ? ('right' as const) : ('left' as const),
					content: msg.attributes.message,
					avatar: isCurrentUser ? undefined : avatarPlaceholder,
					timestamp,
				}
			})
			return mappedMessages
		}
		return type === 'chat' ? mockMessages : requestMessages
	}, [apiMessages, chatRoomId, user, type])

	const lastMessageDateTime = useMemo(() => {
		if (apiMessages && apiMessages.length > 0) {
			const lastMessage = apiMessages[apiMessages.length - 1]
			const date = new Date(lastMessage.attributes.created_at)
			const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
			const time = date.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			})
			return `${dayName} ${time}`
		}
		return null
	}, [apiMessages])

	useEffect(() => {
		hasInitialScrolled.current = false
	}, [chatRoomId])

	useEffect(() => {
		const container = messagesContainerRef.current
		if (!container || hasInitialScrolled.current) return

		if (messages.length > 0 && !isLoadingMessages && !isFetchingNextPage && messagesData) {
			const scrollToBottom = () => {
				if (container) {
					container.scrollTop = container.scrollHeight
					hasInitialScrolled.current = true
				}
			}

			requestAnimationFrame(() => {
				scrollToBottom()
				requestAnimationFrame(() => {
					scrollToBottom()
					setTimeout(() => {
						if (container && !hasInitialScrolled.current) {
							scrollToBottom()
						}
					}, 150)
				})
			})
		}
	}, [messages.length, isLoadingMessages, isFetchingNextPage, chatRoomId, messagesData])

	const isFirstInGroup = (index: number): boolean => {
		const currentMessage = messages[index]
		const previousMessage = messages[index - 1]

		if (!previousMessage) return true

		return currentMessage.variant !== previousMessage.variant
	}

	const isLastInGroup = (index: number): boolean => {
		const currentMessage = messages[index]
		const nextMessage = messages[index + 1]

		if (!nextMessage) return true

		return currentMessage.variant !== nextMessage.variant
	}

	const handleLoadMore = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	if (isLoadingMessages) {
		return (
			<section className={styles.container}>
				<div className={styles.chatMessagesContainer}>
					<div className={styles.dateTime}>Loading messages...</div>
				</div>
			</section>
		)
	}

	if (messagesError) {
		return (
			<section className={styles.container}>
				<div className={styles.chatMessagesContainer}>
					<div className={styles.dateTime}>Failed to load messages. Please try again.</div>
				</div>
			</section>
		)
	}

	if (messagesData && apiMessages.length === 0) {
		return (
			<section className={styles.container}>
				<div className={styles.chatMessagesContainer}>
					<div className={styles.dateTime}>No conversation yet. Start by sending a message!</div>
				</div>
			</section>
		)
	}

	return (
		<section className={styles.container}>
			<div
				id="scrollableDiv"
				className={styles.chatMessagesContainer}
				ref={messagesContainerRef}
				style={{ display: 'flex', flexDirection: 'column-reverse' }}
			>
				<InfiniteScroll
					dataLength={messages.length}
					next={handleLoadMore}
					hasMore={!!hasNextPage && !isFetchingNextPage}
					loader={<div className={styles.dateTime}>Loading older messages...</div>}
					inverse={true}
					scrollableTarget="scrollableDiv"
					style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}
				>
					{/* Chat Bubbles */}
					{messages.map((message, index) => (
						<ChatBubble
							key={message.id}
							variant={message.variant}
							content={message.content}
							avatar={message.avatar}
							timestamp={message.timestamp}
							isFirstInGroup={isLastInGroup(index)} // reverse logic since infinite scroll is in reverse order
							isLastInGroup={isFirstInGroup(index)} // reverse logic since infinite scroll is in reverse order
						/>
					))}

					{lastMessageDateTime && <div className={styles.dateTime}>{lastMessageDateTime}</div>}
				</InfiniteScroll>
			</div>

			{type === 'chat' ? (
				<></>
			) : (
				<div className={styles.pendingChatContainer}>
					<Separator />
					<span className={styles.pendingChatText}>
						Do you want to accept message request from{' '}
						<span className={styles.name}>Neomi Gutierez</span>?
					</span>
					<CustomButton
						data-accept="accept"
						className={styles.iconAcceptButton}
						variant="primary"
						radius="full"
					>
						Accept
					</CustomButton>
					<div className={styles.actionsContainer}>
						<CustomButton
							data-accept="warn"
							className={styles.iconAcceptButton}
							variant="outline"
							radius="full"
						>
							Delete
						</CustomButton>
						<CustomButton
							data-accept="warn"
							className={styles.iconAcceptButton}
							variant="outline"
							radius="full"
						>
							Block
						</CustomButton>
					</div>
				</div>
			)}
		</section>
	)
}

export default ChatMessages
