import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import Button from '@/components/atoms/button/Button'
import Avatar from '@/components/atoms/avatar/Avatar'
import { sideMenuData } from '@/mocks/dummyData'
import { useRouter, usePathname } from 'next/navigation'
import style from './SideMenu.module.scss'

type SideMenuProps = {
	type?: 'large' | 'small'
}
const SideMenu = ({ type }: SideMenuProps) => {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div
			className={`${style.container} ${type === 'large' ? style.containerLarge : style.containerSmall}`}
		>
			<div className={style.wrapper}>
				{sideMenuData.map(item =>
					item.label ? (
						<div
							className={`${style.wrapperInner} ${type === 'small' ? style.wrapperInnerSmall : ''} ${pathname === item.href ? style.active : ''}`}
							key={item.label}
							onClick={() => {
								router.push(item.href)
								router.refresh()
							}}
						>
							<ButtonIcon
								icon={pathname === item.href ? (item.activeIcon ?? '') : item.icon}
								variant="text"
								styleType="icon"
								size={22}
								extraClass={style.wrapperInnerButton}
								tintColor={'var(--jh-green-04)'}
							/>
							{type === 'large' && <label>{item.label}</label>}
						</div>
					) : (
						<div key={item.label}>
							{type === 'large' && (
								<div className={style.wrapperInner} key={item.label}>
									<div className={style.wrapperInnerSeparator} />
								</div>
							)}
						</div>
					)
				)}
			</div>
			<div className={style.dashboard}>
				{type === 'large' && <Button label="Dashboard" extraClass={style.extraClass}></Button>}
				{type === 'small' && (
					<ButtonIcon
						icon={'/icons/dashboard.svg'}
						variant="circular"
						styleType="icon"
						size={22}
						extraClass={style.extra}
					/>
				)}
				<div className={style.avatar}>
					<Avatar size={44} src="/images/1.jpg" extraClass={style.avatar} />
					{type === 'large' && (
						<div>
							<span className={style.avatarName}>Xich Atibagos</span>
							<span className={style.avatarUserName}>@xich</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default SideMenu
