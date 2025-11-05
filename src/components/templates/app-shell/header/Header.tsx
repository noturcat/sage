'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import CustomButton from '@/components/atoms/button/CustomButton'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import { communityLinks } from '@/components/templates/app-shell/header/headerLinks'
import { useLayout } from '@/hooks/useLayout'

import style from './Header.module.scss'

function Header() {
	const pathname = usePathname()
	const router = useRouter()
	const layout = useLayout()

	const isCommunity = pathname.includes('/community')

	const handleHome = () => {
		router.push('/')
	}

	return (
		<section className={style.header} data-community={isCommunity ? 'true' : 'false'}>
			<div className={style.logo} data-community={isCommunity ? 'true' : 'false'}>
				<Image
					src={'/images/jh-logo.png'}
					alt={'Just Holistics'}
					width={30}
					height={20}
					onClick={handleHome}
				/>
			</div>
			{layout.showCommunityLinks && (
				<div className={style.communityLinks} data-community={isCommunity ? 'true' : 'false'}>
					{communityLinks.map((link, index) => (
						<Tooltip key={index}>
							<Tooltip.Trigger>
								<CustomButton
									variant="text"
									className={style.link}
									onClick={() => router.push(link.path)}
									data-active={pathname === link.path}
								>
									{link.label === 'Videos' ? (
										<Image
											src={
												pathname === link.path ? '/icons/active-videos.svg' : '/icons/videos.svg'
											}
											alt={link.label}
											width={20}
											height={20}
											unoptimized
										/>
									) : link.label === 'Events' ? (
										<Image
											src={
												pathname === link.path ? '/icons/active-events.svg' : '/icons/events.svg'
											}
											alt={link.label}
											width={20}
											height={20}
											unoptimized
										/>
									) : (
										<span
											className={pathname === link.path ? style.iconActive : style.icon}
											data-icon={link.label}
										/>
									)}
								</CustomButton>
							</Tooltip.Trigger>
							<Tooltip.Content>{link.label}</Tooltip.Content>
						</Tooltip>
					))}
				</div>
			)}
			<div className={style.actions}>
				<CustomButton
					variant="outline"
					radius="full"
					className={style.donate}
					onClick={() => router.push('/donate')}
				>
					Donate
					<span className={style.iconDonate} />
				</CustomButton>
			</div>
		</section>
	)
}

export default Header
