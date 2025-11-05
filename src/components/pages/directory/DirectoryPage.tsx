'use client'

import { useEffect, useMemo, useState } from "react"
import { categoryRepository } from '@/repositories/CategoryRepository'
import { CategoryType } from "@/types/Category.type"
import SearchBar from "@/components/atoms/search-bar/SearchBar"
import style from "./DirectoryPage.module.scss"
import CategoryCard from "@/components/molecules/cards/category-card/CategoryCard"

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
			;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

const DirectoryPage = () => {
	const [categories, setCategories] = useState<CategoryType[]>([])

	useEffect(() => {
		const fetchCategories = async () => {
			const result = await categoryRepository.paginate({ perPage: 100 })
			setCategories(result?.data || [])
		}
		fetchCategories()
	}, [])

	const labelFromCategory = (category: CategoryType): string | undefined => {
		return (category.attributes.name ?? '').toString().trim() || undefined
	}

	const randomSuggestions = useMemo(() => {
		const labels = categories
			.map(labelFromCategory)
			.filter((s): s is string => Boolean(s))
		return shuffle(labels).slice(0, 25)
	}, [categories])

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.heading}>
					<label className={style.subHeading}>Discover More of What Matters to You</label>
					<h1 className={style.title}>Browse Directory</h1>
					<label className={style.subtitle}>Or</label>
				</div>

				<div className={style.search}>
					<SearchBar suggestions={randomSuggestions} />
				</div>
			</div>

			<CategoryCard />
		</>
	)
}

export default DirectoryPage
