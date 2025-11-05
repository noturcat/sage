'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { categoryRepository } from '@/repositories/CategoryRepository'
import { CategoryType } from "@/types/Category.type"
import type { SortItem } from '@/components/atoms/sort/Sort'
import Sort from "@/components/atoms/sort/Sort"
import style from "./CategoryCard.module.scss"
import BentoCard from "@/components/atoms/bento-card/BentoCard"

const CategoryCard = () => {
	const [categories, setCategories] = useState<CategoryType[]>([])

	console.log(categories)

	useEffect(() => {
		const fetchCategories = async () => {
			const result = await categoryRepository.paginate({ perPage: 100 })
			setCategories(result?.data || [])
		}
		fetchCategories()
	}, [])

	const sortItems: (SortItem | 'divider')[] = [
		{ key: 'featured', label: 'Featured' },
		{ key: 'title', label: 'Title' },
		{ key: 'trending', label: 'Trending' },
		{ key: 'most-recent', label: 'Most Recent' },
		{ key: 'most-popular', label: 'Most Popular' },
	]

	return (
		<div className={style.wrapper}>
			<div className={style.filter}>
				<Image src={'/icons/box.svg'} alt={'list-box'} width={21} height={21} />

				<Sort
					items={sortItems}
					align="right"
					triggerClassName={style.sortFilter}
					isWhiteChevron={true}
				/>
			</div>

			<BentoCard
				textAutoHide={true}
				enableSpotlight={true}
				enableBorderGlow={true}
				enableTilt={false}
				enableMagnetism={false}
				clickEffect={true}
				spotlightRadius={300}
				glowColor="24, 172, 106"
			/>

			<div className={style.viewMore}>
				<label>View More</label>
				<div>
					<div className={style.chevron}></div>
					<div className={style.chevron}></div>
					<div className={style.chevron}></div>
				</div>
			</div>
		</div>
	)
}

export default CategoryCard
