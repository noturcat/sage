'use client'

import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useGetCategories } from '@/app/api/categories/queries/categories'

import style from './CategoriesCarousel.module.scss'

/**
 * **Horizontal scrollable carousel** for category navigation.
 *
 * Interactive carousel component that displays categories in a horizontally scrollable container.
 * Features intelligent navigation buttons that automatically show/hide based on scroll position and content overflow.
 *
 * Example:
 * ```tsx
 * <CategoriesCarousel categories={categories} />
 * ```
 *
 * Notes:
 * - Dynamic navigation button visibility based on scroll position.
 * - Smooth scrolling animation with configurable scroll distance.
 * - Automatic overflow detection and button state management.
 * - Click-to-select category highlighting with active state.
 * - Drag scroll support for mouse and touch interactions.
 */

function CategoriesCarousel() {
	const carouselRef = useRef<HTMLDivElement>(null)
	const [showLeftButton, setShowLeftButton] = useState(false)
	const [showRightButton, setShowRightButton] = useState(false)
	const { data: categoriesData, isPending } = useGetCategories()
	const [activeCategory, setActiveCategory] = useState(categoriesData?.data?.[0]?.id)

	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	const updateButtonVisibility = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current

			const hasOverflow = scrollWidth > clientWidth

			if (!hasOverflow) {
				setShowLeftButton(false)
				setShowRightButton(false)
			} else {
				setShowLeftButton(scrollLeft > 0)
				setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1)
			}
		}
	}, [])

	const handleScroll = (direction: 'left' | 'right') => {
		if (carouselRef.current) {
			const scrollAmount = 200
			const currentScrollLeft = carouselRef.current.scrollLeft
			const newScrollLeft =
				direction === 'left' ? currentScrollLeft - scrollAmount : currentScrollLeft + scrollAmount

			carouselRef.current.scrollTo({
				left: newScrollLeft,
				behavior: 'smooth',
			})

			setTimeout(updateButtonVisibility, 300)
		}
	}

	useEffect(() => {
		const carousel = carouselRef.current
		if (carousel) {
			carousel.addEventListener('scroll', updateButtonVisibility)
			updateButtonVisibility()

			const handleResize = () => {
				setTimeout(updateButtonVisibility, 100)
			}
			window.addEventListener('resize', handleResize)

			return () => {
				carousel.removeEventListener('scroll', updateButtonVisibility)
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [updateButtonVisibility])

	useLayoutEffect(() => {
		const id = requestAnimationFrame(() => updateButtonVisibility())
		return () => cancelAnimationFrame(id)
	}, [updateButtonVisibility, categoriesData?.data?.length, isPending])

	const handleCategoryClick = (categoryId: number) => {
		setActiveCategory(categoryId)
	}

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!carouselRef.current) return

		setIsDragging(true)
		setStartX(e.pageX - carouselRef.current.offsetLeft)
		setScrollLeft(carouselRef.current.scrollLeft)

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
		setTimeout(updateButtonVisibility, 100)
	}

	const handleMouseLeave = () => {
		setIsDragging(false)
	}

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
		setTimeout(updateButtonVisibility, 100)
	}

	return (
		<>
			{categoriesData?.data?.length === 0 ? (
				<div className={style.noCategories}>
					<p>No categories found</p>
				</div>
			) : (
				<main className={style.carouselWrapper}>
					{showLeftButton && (
						<CustomButton
							variant="text"
							className={style.carouselLeftButton}
							onClick={() => handleScroll('left')}
						>
							<span className={style.iconChevronLeft} />
						</CustomButton>
					)}
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
						{isPending && (
							<div className={style.skeletonGroup}>
								{Array.from({ length: 8 }).map((_, index) => (
									<Skeleton key={index} className={style.skeleton} />
								))}
							</div>
						)}
						{categoriesData?.data?.map(category => (
							<p
								key={category.id}
								onClick={() => handleCategoryClick(category.id)}
								className={activeCategory === category.id ? style.active : style.carouselItem}
							>
								{category.attributes.name}
							</p>
						))}
					</div>

					{showRightButton && (
						<CustomButton
							variant="text"
							className={style.carouselRightButton}
							onClick={() => handleScroll('right')}
						>
							<span className={style.iconChevronRight} />
						</CustomButton>
					)}
				</main>
			)}
		</>
	)
}

export default CategoriesCarousel
