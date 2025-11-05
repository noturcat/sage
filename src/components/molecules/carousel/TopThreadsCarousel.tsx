'use client'

import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react'
import TopThreadCard from '@/components/molecules/cards/thread-card/TopThreadCard'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useGetThreads } from '@/app/api/threads/queries/threads'

import style from './TopThreadsCarousel.module.scss'

/**
 * **Interactive carousel** for displaying top threads.
 *
 * Feature-rich horizontal carousel component that displays top threads with smooth scrolling,
 * drag-to-scroll functionality, and intelligent navigation buttons. Features automatic button visibility.
 *
 * Example:
 * ```tsx
 * <TopThreadsCarousel />
 * ```
 *
 * Notes:
 * - Horizontal scrolling carousel with smooth animations.
 * - Intelligent navigation buttons (auto-hide when not needed).
 * - Drag-to-scroll functionality for desktop users.
 * - Touch support for mobile and tablet devices.
 * - Automatic button visibility based on scroll position and content overflow.
 * - Responsive design that adapts to different screen sizes.
 */

function TopThreadsCarousel() {
	const carouselRef = useRef<HTMLDivElement>(null)
	const [showLeftButton, setShowLeftButton] = useState(false)
	const [showRightButton, setShowRightButton] = useState(false)

	const { data: threadsData, isPending } = useGetThreads()

	// Drag scroll state
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	const updateButtonVisibility = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current

			// Check if there's overflow (content doesn't fit)
			const hasOverflow = scrollWidth > clientWidth

			if (!hasOverflow) {
				// Hide both buttons if no overflow
				setShowLeftButton(false)
				setShowRightButton(false)
			} else {
				// Show left button if not at the start
				setShowLeftButton(scrollLeft > 0)
				// Show right button if not at the end (with small tolerance for precision)
				setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1)
			}
		}
	}, [])

	const handleScroll = (direction: 'left' | 'right') => {
		if (carouselRef.current) {
			const scrollAmount = 600
			const currentScrollLeft = carouselRef.current.scrollLeft
			const newScrollLeft =
				direction === 'left' ? currentScrollLeft - scrollAmount : currentScrollLeft + scrollAmount

			carouselRef.current.scrollTo({
				left: newScrollLeft,
				behavior: 'smooth',
			})

			// Update button visibility after scrolling (increase timeout for smooth animation)
			setTimeout(updateButtonVisibility, 300)
		}
	}

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
		// Update button visibility after drag ends
		setTimeout(updateButtonVisibility, 100)
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
		setTimeout(updateButtonVisibility, 100)
	}

	useEffect(() => {
		const carousel = carouselRef.current
		if (carousel) {
			// Add scroll event listener
			carousel.addEventListener('scroll', updateButtonVisibility)

			// Initial button visibility check
			updateButtonVisibility()

			// Handle window resize
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
	}, [updateButtonVisibility, threadsData?.data?.length, isPending])

	return (
		<main className={style.carouselWrapper}>
			{showLeftButton && (
				<button className={style.carouselLeftButton} onClick={() => handleScroll('left')}>
					<span className={style.iconChevronLeft} />
				</button>
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
						{Array.from({ length: 4 }).map((_, index) => (
							<Skeleton key={index} className={style.skeleton} />
						))}
					</div>
				)}

				{threadsData?.data?.map(thread => (
					<TopThreadCard key={thread.id} threads={thread} />
				))}
			</div>
			{threadsData?.data?.length === 0 && (
				<div className={style.noThreads}>
					<p>No threads found</p>
				</div>
			)}
			{showRightButton && (
				<button className={style.carouselRightButton} onClick={() => handleScroll('right')}>
					<span className={style.iconChevronRight} />
				</button>
			)}
		</main>
	)
}

export default TopThreadsCarousel
