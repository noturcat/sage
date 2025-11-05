'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/atoms/avatar/Avatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import { useLayout } from '@/hooks/useLayout'
import style from './ProfileAvatar.module.scss'

const ProfileAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	(props, ref) => {
		const layout = useLayout()
		const router = useRouter()

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation()
			router.push('/notifications')
		}
		return (
			<div
				ref={ref}
				className={style.avatar}
				data-layout={layout.isNavCollapsed ? 'true' : 'false'}
				{...props}
			>
				<section className={style.avatarGroup}>
					<Avatar src={'/images/1.jpg'} alt="Avatar" size={44} />
					<p className={style.info} data-layout={layout.isNavCollapsed ? 'true' : 'false'}>
						<span className={style.name}>John Doe</span>
						<span className={style.username}>@Jon Doe</span>
					</p>
				</section>
				{!layout.isNavCollapsed && (
					<Tooltip>
						<Tooltip.Trigger>
							<section className={style.action}>
								<CustomButton
									variant="text"
									size="icon"
									radius="full"
									className={style.icon}
									onClick={handleClick}
								>
									<abbr title="Notifications">
										<span className={style.iconNotification} />
									</abbr>
								</CustomButton>
							</section>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Notifications</p>
						</Tooltip.Content>
					</Tooltip>
				)}
			</div>
		)
	}
)

ProfileAvatar.displayName = 'ProfileAvatar'

export default ProfileAvatar
