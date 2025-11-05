'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/avatar/Avatar'
import style from './Notifications.module.scss'

export type NotificationItem = {
	id: string
	title: string
	description?: string
	time?: string
	unread?: boolean
	iconSrc?: string
	avatarSrc?: string
}

export type NotificationsProps = {
	items: NotificationItem[]
	onClose?: () => void
	onMarkAllRead?: () => void
	onItemClick?: (item: NotificationItem) => void
	className?: string
	emptyText?: string
	title?: string
	showFooter?: boolean
	footerText?: string
	type?: 'full' | 'mini'
}

const Notifications = ({
	items,
	onClose,
	onMarkAllRead,
	onItemClick,
	type = 'full',
	className,
	emptyText = 'No notifications',
	title = 'Notifications',
	showFooter = false,
	footerText = 'See all notifications',
}: NotificationsProps) => {
	const [localItems, setLocalItems] = React.useState<NotificationItem[]>(items)
	const containerRef = React.useRef<HTMLDivElement | null>(null)
	const [tab, setTab] = React.useState<'all' | 'unread'>('all')
	const { push } = useRouter()
	React.useEffect(() => {
		setLocalItems(items)
	}, [items])

	React.useEffect(() => {
		const handleDocClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				onClose?.()
			}
		}
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose?.()
		}
		document.addEventListener('mousedown', handleDocClick)
		document.addEventListener('keydown', handleKey)
		return () => {
			document.removeEventListener('mousedown', handleDocClick)
			document.removeEventListener('keydown', handleKey)
		}
	}, [onClose])

	const markAllRead = () => {
		setLocalItems(prev => prev.map(item => ({ ...item, unread: false })))
		onMarkAllRead?.()
	}

	const filtered = React.useMemo(
		() => (tab === 'unread' ? localItems.filter(item => item.unread) : localItems),
		[tab, localItems]
	)

	const displayItems = React.useMemo(() => {
		return type === 'mini' ? filtered.slice(0, 5) : filtered
	}, [filtered, type])

	const goToNotifications = () => {
		push('/community/notifications')
	}

	return (
		<div
			ref={containerRef}
			className={`${style.notifications} ${type === 'mini' ? style.mini : style.full} ${className ?? ''}`}
			role="dialog"
			aria-label={title}
		>
			<div className={style.notificationsHeader}>
				<h3 className={style.notificationsHeaderTitle}>{title}</h3>
				<div className={style.notificationsHeaderActions}>
					{type === 'full' && localItems.some(item => item.unread) && (
						<span className={style.notificationsHeaderActionBtn} onClick={markAllRead}>
							Mark all as read
						</span>
					)}
				</div>
			</div>
			{type === 'full' && (
				<div className={style.notificationsTabs}>
					<button
						type="button"
						className={`${style.notificationsTabsTab} ${tab === 'all' ? style.activeTab : ''}`}
						onClick={() => setTab('all')}
					>
						All
					</button>
					<button
						type="button"
						className={`${style.notificationsTabsTab} ${tab === 'unread' ? style.activeTab : ''}`}
						onClick={() => setTab('unread')}
					>
						Unread
					</button>
				</div>
			)}
			{type === 'full' && <div className={style.notificationsNew}>New</div>}
			{displayItems.length === 0 ? (
				<div className={style.notificationsEmpty}>{emptyText}</div>
			) : (
				<ul className={style.notificationsList} role="list">
					{displayItems.map(item => (
						<li
							key={item.id}
							className={`${style.notificationsListItem} ${item.unread ? style.unread : ''}`}
						>
							<div
								className={style.notificationsListItemContent}
								onClick={() => onItemClick?.(item)}
							>
								{item.avatarSrc ? (
									<Avatar src={item.avatarSrc} alt="" size={45} />
								) : (
									item.iconSrc && <Avatar src={item.iconSrc} alt="" size={20} />
								)}
								<div className={style.notificationsListItemContentText}>
									<span className={style.notificationsListItemContentTextTitle}>
										<span className={style.notificationsListItemContentTextTitleText}>
											<span>{item.title}&nbsp;</span>
											{item.description && (
												<span
													className={style.notificationsListItemContentTextTitleTextDescription}
												>
													{item.description}
												</span>
											)}
										</span>
										{item.time && (
											<span className={style.notificationsListItemContentTextTitleTime}>
												{item.time}
											</span>
										)}
									</span>
									{item.unread && (
										<span className={style.notificationsUnreadDot} aria-hidden="true" />
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
			{showFooter && type !== 'full' && (
				<button type="button" className={style.notificationsFooter} onClick={goToNotifications}>
					{footerText}
				</button>
			)}
		</div>
	)
}

export default Notifications
