import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import { useState } from 'react'
import style from './TopSearches.module.scss'

interface TopSearchesProps {
	onSearchClick?: (searchTerm: string) => void
}

const TopSearches = ({ onSearchClick }: TopSearchesProps) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	const searchItems = [
		'How to cook Sinigang',
		'What is functional medicine?',
		'Holistic health benefits',
		'Natural detox methods',
		'Nutrition for wellness',
	]

	const handleSearchClick = (searchTerm: string) => {
		if (onSearchClick) {
			onSearchClick(searchTerm)
		}
	}
	return (
		<div className={style.wrapperContent}>
			<div className={style.wrapperContentHeader}>
				<ButtonIcon icon="/icons/top-searches.svg" variant="text" styleType="icon" size={38} />
				<span>Top Searches:</span>
			</div>
			<div className={style.wrapperContentTopSearches}>
				{searchItems.map((item, index) => (
					<div
						key={index}
						className={style.searchItem}
						onClick={() => handleSearchClick(item)}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
					>
						<ButtonIcon
							icon="/icons/magnifying-glass.svg"
							variant="text"
							styleType="icon"
							size={24}
							tintColor={hoveredIndex === index ? `var(--jh-green-04)` : `var(--black)`}
						/>
						<span>{item}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default TopSearches
