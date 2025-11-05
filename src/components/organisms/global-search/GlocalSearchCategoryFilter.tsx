'use client'

import { useRef, useState } from 'react'
import type { Category } from "./GlobalSearch.types";
import style from './GlobalSearch.module.scss'

interface GlocalSearchCategoryFilterProps {
	categories: Category[]
	onActiveCategory: (category: Category) => void
}

const GlocalSearchCategoryFilter = ({ categories, onActiveCategory }: GlocalSearchCategoryFilterProps) => {
	const carouselRef = useRef<HTMLDivElement>(null)
	const [activeCategory, setActiveCategory] = useState<Category>("All");

	// Drag scroll state
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	// Drag scroll handlers
	const handleMouseDown = (e: React.MouseEvent) => {
		if (!carouselRef.current) return

		setIsDragging(true)
		setStartX(e.pageX - carouselRef.current.offsetLeft)
		setScrollLeft(carouselRef.current.scrollLeft)

		// Prevent text selection while dragging
		e.preventDefault()
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !carouselRef.current) return

		e.preventDefault()
		const x = e.pageX - carouselRef.current.offsetLeft
		const walk = (x - startX) * 2 // Multiply by 2 for faster scrolling
		carouselRef.current.scrollLeft = scrollLeft - walk
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseLeave = () => {
		setIsDragging(false)
	}

	// Touch handlers for mobile
	const handleTouchStart = (e: React.TouchEvent) => {
		if (!carouselRef.current) return

		setIsDragging(true)
		setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
		setScrollLeft(carouselRef.current.scrollLeft)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !carouselRef.current) return

		const x = e.touches[0].pageX - carouselRef.current.offsetLeft
		const walk = (x - startX) * 2
		carouselRef.current.scrollLeft = scrollLeft - walk
	}

	const handleTouchEnd = () => {
		setIsDragging(false)
	}

	const handleActiveCategory = (category: Category) => {
		setActiveCategory(category)
		onActiveCategory(category)
	}

	return (
		<main className={style.carouselWrapper}>
			<div
				className={`${style.carousel} ${isDragging ? style.dragging : ''}`}
				ref={carouselRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{categories.map(category => (
					<button
						key={category}
						role="tab"
						aria-selected={activeCategory === category}
						className={`${style.chip} ${activeCategory === category ? style.active : style.carouselItem}`}
						onClick={() => handleActiveCategory(category)}
					>
						{category}
					</button>
				))}
			</div>
		</main>
	)
}

export default GlocalSearchCategoryFilter
