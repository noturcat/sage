import Avatar from '@/components/atoms/avatar/Avatar'
import { generateShortcuts } from '@/mocks/dummyData'

import style from './YourShortcuts.module.scss'

type YourShortcutsProps = {
	yourShortcuts?: {
		label?: string
		icon?: string
	}[]
}

const YourShortcuts = ({ yourShortcuts = generateShortcuts(4) }: YourShortcutsProps) => {
	return (
		<div className={style.yourShortcuts}>
			<div className={style.yourShortcutsHeader}>
				<h1>Your shortcuts</h1>
			</div>
			<div className={style.yourShortcutsList}>
				{yourShortcuts.map((item, index) => (
					<div className={style.yourShortcutsItem} key={`${item.label}-${index}`}>
						<div className={style.yourShortcutsItemIcon}>
							<Avatar
								src={item.icon ?? '/images/1.jpg'}
								size={40}
								extraClass={style.yourShortcutsItemIconAvatar}
							/>
						</div>
						<div className={style.yourShortcutsItemLabel}>
							<h3>{item.label ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</h3>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default YourShortcuts
