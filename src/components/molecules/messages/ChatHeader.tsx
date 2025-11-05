'use client'

import { useMemo } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/avatar/Avatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import styles from './ChatHeader.module.scss'
import { useGetChatRoom } from '@/app/api/messages/queries/chat-rooms'
import type { ChatRoomType } from '@/types/ChatRoom.type'
import useUserStore from '@/store/UserStore'

interface ChatHeaderProps {
	compact?: boolean
	hideDetailsButton?: boolean
	avatar?: string
	fullName?: string
	username?: string
}

function ChatHeader({ compact, hideDetailsButton, avatar, fullName, username }: ChatHeaderProps) {
	const router = useRouter()
	const user = useUserStore(state => state.user)

	// Get header info from the url
	const pathname = usePathname()
	const { chatRoomId } = useParams()

	const { data: chatRoom, isLoading } = useGetChatRoom(chatRoomId as string)

	const selectedChat = useMemo(() => {
		if (!chatRoom || !chatRoomId) return null

		const users = chatRoom.attributes.users as ChatRoomType['attributes']['users']
		const currentUserId = user?.id

		// Find the other user (not the current user)
		const otherUser = Array.isArray(users)
			? users.find(u => String(u.id) !== String(currentUserId)) || users[0]
			: null

		if (!otherUser) return null

		const fullName = `${otherUser.first_name} ${otherUser.last_name}`.trim()
		const username = otherUser.username || 'unknown'
		const avatarPlaceholder = '/images/avatar-placeholder.png'

		return {
			name: fullName,
			username,
			avatar: avatarPlaceholder,
		}
	}, [chatRoom, chatRoomId, user])

	const displayAvatar = avatar || selectedChat?.avatar || '/images/avatar-placeholder.png'
	const displayName = fullName || selectedChat?.name || ''
	const displayUsername = username || selectedChat?.username || ''

	const handleViewDetails = () => {
		// Get the filter type from the path
		const filterType = pathname.split('/')[2]

		router.push(`/messages/${filterType}/${chatRoomId}/details`)
	}

	// Show loading skeleton when data is being fetched and no props are provided
	const showLoading = isLoading && !avatar && !fullName && !username && !selectedChat

	if (showLoading) {
		return (
			<div
				className={`${styles.userInfoContainer} ${hideDetailsButton ? '' : styles.showSeparator}`}
			>
				<div className={styles.userInfo}>
					<Skeleton
						radius="full"
						className={styles.userInfoAvatar}
						style={{ width: '40px', height: '40px' }}
					/>
					{compact ? (
						<div className={styles.userInfoCompact}>
							<Skeleton radius="md" style={{ width: '120px', height: '14px' }} />
							<Skeleton radius="md" style={{ width: '80px', height: '14px' }} />
						</div>
					) : (
						<>
							<Skeleton radius="md" style={{ width: '120px', height: '14px' }} />
							<Skeleton radius="md" style={{ width: '80px', height: '14px' }} />
						</>
					)}
				</div>

				{!hideDetailsButton && <Skeleton radius="full" style={{ width: '32px', height: '32px' }} />}
			</div>
		)
	}

	return (
		<div className={`${styles.userInfoContainer} ${hideDetailsButton ? '' : styles.showSeparator}`}>
			<div className={styles.userInfo}>
				<Avatar src={displayAvatar} alt="avatar" size={40} extraClass={styles.userInfoAvatar} />
				{compact ? (
					<div className={styles.userInfoCompact}>
						<span className={styles.userFullName}>{displayName}</span>
						<span className={styles.userName}>@{displayUsername}</span>
					</div>
				) : (
					<>
						<span className={styles.userFullName}>{displayName}</span>
						<span className={styles.userName}>@{displayUsername}</span>
					</>
				)}
			</div>

			{!hideDetailsButton && (
				<CustomButton
					className={styles.iconCreateContainer}
					variant="outline"
					onClick={handleViewDetails}
				>
					<span className={styles.iconCreate} />
				</CustomButton>
			)}
		</div>
	)
}

export default ChatHeader
