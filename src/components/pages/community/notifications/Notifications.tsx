'use client'
import React from 'react'
import NotificationsMain from '@/components/molecules/notifications/Notifications'
import { defaultNotificationItems } from '@/mocks/dummyData'
import style from './Notifications.module.scss'

const Notifications = () => {
	const notificationsItems = defaultNotificationItems
	return (
		<div className={style.wrapper}>
			<div className={style.wrapperLeft}>
				<NotificationsMain
					items={notificationsItems}
					onMarkAllRead={() => console.log('all read')}
					onItemClick={n => console.log('clicked', n)}
					showFooter
					footerText="See all notifications"
					type="full"
				/>
			</div>
		</div>
	)
}

export default Notifications
