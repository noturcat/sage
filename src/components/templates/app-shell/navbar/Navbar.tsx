'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CustomButton from '@/components/atoms/button/CustomButton'
import ProfileAvatar from '@/components/molecules/avatar-group/ProfileAvatar'
import Divider from '@/components/atoms/divider/Divider'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import {
	navbarLinks,
	type NavbarLink,
	profileLinks,
} from '@/components/templates/app-shell/navbar/navbarLinks'
import { useLayout } from '@/hooks/useLayout'
import { useGlobalSearch } from '@/providers/GlobalSearchProvider'
import style from './Navbar.module.scss'

interface NavLinkItemProps {
	link: NavbarLink
	isActive: boolean
	isCollapsed: boolean
	onSearchClick: () => void
}

function NavLinkItem({ link, isActive, isCollapsed, onSearchClick }: NavLinkItemProps) {
	const linkContent = (
		<Link
			href={link.path}
			className={style.link}
			data-layout={isCollapsed ? 'true' : 'false'}
			data-active={isActive}
			onClick={e => {
				if (link.label === 'Search') {
					e.preventDefault()
					onSearchClick()
				}
			}}
		>
			{link.label === 'Discovery' ? (
				<Image
					src={isActive ? '/icons/active-discover.svg' : '/icons/discover.svg'}
					alt={link.label}
					width={22}
					height={22}
					className={style.iconImage}
					unoptimized
				/>
			) : (
				<span className={style.icon} data-icon={link.label} data-active={isActive} />
			)}
			<span className={style.label} data-layout={isCollapsed ? 'true' : 'false'}>
				{link.label}
			</span>
		</Link>
	)

	if (!isCollapsed) return linkContent

	return (
		<Tooltip placement="right">
			<Tooltip.Trigger>{linkContent}</Tooltip.Trigger>
			<Tooltip.Content>{link.label}</Tooltip.Content>
		</Tooltip>
	)
}

interface DashboardButtonProps {
	isCollapsed: boolean
}

function DashboardButton({ isCollapsed }: DashboardButtonProps) {
	const button = (
		<CustomButton
			radius="full"
			size={isCollapsed ? 'icon' : 'md'}
			className={style.button}
			data-layout={isCollapsed ? 'true' : 'false'}
		>
			<span className={style.icon} data-layout={isCollapsed ? 'true' : 'false'}>
				<span className={style.iconDashboard} />
			</span>

			<span className={style.label} data-layout={isCollapsed ? 'true' : 'false'}>
				Dashboard
			</span>
		</CustomButton>
	)

	if (!isCollapsed) return button

	return (
		<Tooltip placement="right">
			<Tooltip.Trigger>{button}</Tooltip.Trigger>
			<Tooltip.Content>Dashboard</Tooltip.Content>
		</Tooltip>
	)
}

/**
 * **Navbar component** for displaying the navigation links in the app shell.
 *
 * Provides a flexible layout for displaying the navigation links and the dashboard button.
 *
 * Example:
 *
 * ```tsx
 * <Navbar />
 * ```
 *
 * Notes:
 * - Displays the navigation links and the dashboard button.
 */

function Navbar() {
	const pathname = usePathname()
	const router = useRouter()
	const layout = useLayout()
	const { open: openGlobalSearch, isOpen } = useGlobalSearch()

	const isActive = (path: string) => {
		if (path === '/') return false
		return pathname.includes(path)
	}

	return (
		<div className={style.navbar}>
			{/* {layout.isNavCollapsed ? ( */}
			<div className={style.menu} data-layout={layout.isNavCollapsed ? 'true' : 'false'}>
				<DropdownMenu>
					<DropdownMenu.Trigger>
						<section className={style.menuAvatar}>
							<ProfileAvatar />
						</section>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content className={style.content}>
						{profileLinks.map(link => (
							<DropdownMenu.Item
								key={link.label}
								onClick={() => router.push(link.path)}
								className={style.item}
							>
								<span
									className={style.icon}
									data-icon={link.label}
									data-show={link.label !== 'Notifications' && !layout.isNavCollapsed}
								/>
								{link.label}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu>
			</div>
			{/* // ) : ( */}
			<section className={style.avatar} data-layout={layout.isNavCollapsed ? 'true' : 'false'}>
				<ProfileAvatar onClick={() => router.push('/profile')} />
			</section>
			{/* // )} */}

			<section className={style.links}>
				{navbarLinks.map(link => {
					const isLinkActive = link.label === 'Search' ? isOpen : isActive(link.path)
					return (
						<div key={link.label}>
							{link.label === 'Messages' && <Divider extraClass={style.divider} />}
							<NavLinkItem
								link={link}
								isActive={isLinkActive}
								isCollapsed={layout.isNavCollapsed}
								onSearchClick={openGlobalSearch}
							/>
						</div>
					)
				})}
				<div className={style.dashboard} data-layout={layout.isNavCollapsed ? 'true' : 'false'}>
					<DashboardButton isCollapsed={layout.isNavCollapsed} />
				</div>
			</section>
		</div>
	)
}

export default Navbar
