'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import Container from '@/components/util/container/Container'
import style from './NavigationGroup.module.scss'

type NavigationGroupProps = {
	leftNav?: {
		label: string
		icon: string
		activeIcon?: string
		href?: string
		size: number
	}[]
}

const NavigationGroup = ({ leftNav }: NavigationGroupProps) => {
	const { push } = useRouter()
	const pathname = usePathname()

	const active = React.useMemo(() => {
		if (pathname?.includes('/community/pages')) return 'Pages'
		if (pathname?.includes('/community/groups')) return 'Groups'
		if (pathname?.includes('/community/events')) return 'Events'
		if (pathname?.includes('/community/videos')) return 'Videos'
		return 'Newsfeed'
	}, [pathname])

	return (
		<div className={style.wrapper}>
			<Container>
				<div className={style.wrapperInner}>
					<div className={style.wrapperInnerLeft}>
						<Image src={'/images/jh-logo.png'} alt={'Just Holistics'} width={30} height={20} />
					</div>
					<div className={style.wrapperInnerMid}>
						<div className={style.wrapperInnerMidNavigationGroup}>
							{leftNav?.map(item => (
								<div
									key={item.label}
									className={active === item.label ? style.navItemActive : style.navItem}
								>
									<div className={style.navItemWrapper} onClick={() => push(item.href ?? '')}>
										<ButtonIcon
											key={item.label}
											icon={active === item.label ? (item.activeIcon ?? '') : item.icon}
											variant="text"
											styleType="icon"
											size={item.size}
											iconPos="append"
											extraClass={style.leftNavigationButton}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className={style.wrapperInnerRight}>
						<ButtonIcon
							label="Donate"
							variant="primary"
							iconPos="prepend"
							styleType="outlined"
							icon="/icons/donate.svg"
							extraClass={style.extraClass}
						/>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default NavigationGroup
