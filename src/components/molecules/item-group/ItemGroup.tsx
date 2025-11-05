'use client'
import { useState } from 'react'
import style from './ItemGroup.module.scss'

type ItemGroupProps = {
	title: string
	items: { title: string; count: number }[]
}

const initialActiveItem = null as string | null
const ItemGroup = ({ title, items }: ItemGroupProps) => {
	const [activeItem, setActiveItem] = useState<string | null>(initialActiveItem)
	const handleItemClick = (title: string) => {
		setActiveItem(title)
	}
	return (
		<div className={style.wrapper}>
			<div className={style.wrapperInner}>
				<div className={style.wrapperInnerFilter}>
					<div className={style.wrapperInnerFilterItem}>
						<span className={style.wrapperInnerFilterItemTitle}>{title}</span>
					</div>
					<div className={style.wrapperInnerFilterContent}>
						{items.map((item, index) => (
							<div
								className={`${style.wrapperInnerFilterContentItem} ${activeItem === index.toString() ? style.wrapperInnerFilterContentItemActive : ''}`}
								key={index}
								onClick={() => handleItemClick(index.toString())}
							>
								<span className={style.wrapperInnerFilterContentItemTitle}>{item.title}</span>
								<div className={style.wrapperInnerFilterContentItemCount}>
									<span className={style.wrapperInnerFilterContentItemCountNumber}>
										{item.count}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ItemGroup
