'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { deleteCookie, getCookie } from 'cookies-next'
import { authRepository } from '@/repositories/AuthRepository'
import { menuRepository } from '@/repositories/MenuRepository'
import useUserStore from '@/store/UserStore'
import ButtonAnimated from '@/components/atoms/button/ButtonAnimated'
import Button from '@/components/atoms/button/Button'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import A from '@/components/atoms/link/A'
import { useFeature } from '@/flags/FeatureFlagsProvider'
import Container from '@/components/util/container/Container'
// import LanguageSwitcher from '@/components/atoms/lang-switcher/LanguageSwitcher'
import style from './Header.module.scss'
import { HeaderType } from '@/types/Menu.type'

const Header = () => {
	const { push } = useRouter()
	const t = useTranslations('header')
	const donateEnabled = useFeature('donate')
	const [headers, setHeaders] = useState<HeaderType[]>([])
	const isLoggedIn = useUserStore(state => state.isLoggedIn)
	const isLoading = useUserStore(state => state.isLoading)
	const setUser = useUserStore.getState().setUser

	const handleLogout = async () => {
		const token = getCookie('userToken') as string | null

		try {
			if (token) {
				const response = await authRepository.logout()

				if (response === 204) {
					setUser(null)
					deleteCookie('userToken')
				}
			}
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	const handleRoute = (route: string) => {
		push(route)
	}

	useEffect(() => {
		let mounted = true
		const fetchHeaders = async () => {
			try {
				const result = await menuRepository.paginate({
					page: 1,
					perPage: 100,
					sortBy: 'position',
					orderBy: 'asc',
					type: 'header',
				})

				if (!mounted) {
					return
				}

				setHeaders(result?.data ?? [])
			} catch {
				if (!mounted) return
				setHeaders([])
			}
		}

		fetchHeaders()
		return () => {
			mounted = false
		}
	}, [])

	return (
		<header className={style.header}>
			<Container>
				<div className={style.headerInner}>
					<div className={style.headerLogo}>
						<Link href="/">
							<Image
								src={'/icons/just-holistics-logo.svg'}
								alt={'Just Holistics'}
								width={250}
								height={30}
							/>
						</Link>
					</div>
					<nav className={style.headerMenu}>
						{headers && headers.length > 0 ? (
							<ul className={style.headerMenuList}>
								{headers &&
									headers.map((menuItem: HeaderType) => (
										<li
											key={menuItem.attributes.name}
											onClick={() => handleRoute(menuItem.attributes.path)}
										>
											{menuItem.attributes.name ?? ''}
										</li>
									))}
							</ul>
						) : (
							<ul className={style.headerMenuList}>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
								<li className={style.menuSkeleton}></li>
							</ul>
						)}
					</nav>
					<div className={style.headerMenuActionButtons}>
						{/* <LanguageSwitcher /> */}
						{!isLoading && isLoggedIn && headers && headers.length > 0 ? (
							<>
								<Button label={t('dashboard')} variant={'secondary'} styleType={'solid'} />

								<A onClick={handleLogout} color={'white'}>
									{t('logout')}
								</A>
							</>
						) : !isLoading && !isLoggedIn && headers && headers.length > 0 ? (
							<>
								{donateEnabled && (
									<ButtonIcon
										label={t('donate')}
										icon="/icons/green-arrow-right.svg"
										variant={'secondary'}
										size={24}
										styleType={'solid'}
									/>
								)}

								<ButtonAnimated
									variant={'outlined'}
									label={t('joinUs')}
									icon={'/icons/white-arrow-right.svg'}
									hoverIcon={'/icons/green-arrow-right.svg'}
									onClick={() => handleRoute('sign-up')}
								/>
							</>
						) : (
							<div className={style.headerMenuActionButtons}>
								<div className={style.buttonSkeleton}></div>
								<div className={style.buttonSkeleton}></div>
							</div>
						)}
					</div>
				</div>
			</Container>
		</header>
	)
}

export default Header
