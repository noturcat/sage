'use client'

import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import FeaturedProtocolCard from '@/components/molecules/cards/protocol-card/FeaturedProtocolCard'
import { useGetProtocols } from '@/app/api/protocols/queries/protocols'
import style from './FeaturedProtocolsCarousel.module.scss'

/**
 * **Horizontal scrollable carousel** for featured protocols.
 *
 * Interactive carousel component that displays featured protocols in a horizontally scrollable container.
 * Features navigation buttons that remain visible but become disabled when reaching start or end of content.
 *
 * Example:
 * ```tsx
 * <FeaturedProtocolsCarousel />
 * ```
 *
 * Notes:
 * - Always visible navigation buttons with disabled states.
 * - Page-based scrolling (shows 4 cards per page).
 * - Smooth scrolling animation based on container width.
 * - Automatic overflow detection and button state management.
 * - Drag scroll support for mouse and touch interactions.
 */

function FeaturedProtocolsCarousel() {
	const router = useRouter()
	const carouselRef = useRef<HTMLDivElement>(null)
	const [isLeftDisabled, setIsLeftDisabled] = useState(true)
	const [isRightDisabled, setIsRightDisabled] = useState(false)

	// Drag scroll state
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	const { data: protocolsData, isPending } = useGetProtocols()

	const EPS = 2

	const smoothScrollTo = (container: HTMLElement, targetLeft: number, duration: number = 500) => {
		const startLeft = container.scrollLeft
		const distance = targetLeft - startLeft
		const startTime = performance.now()

		const animateScroll = (currentTime: number) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			const ease = 1 - Math.pow(1 - progress, 3)

			container.scrollLeft = startLeft + distance * ease

			if (progress < 1) {
				requestAnimationFrame(animateScroll)
			}
		}

		requestAnimationFrame(animateScroll)
	}

	const handleScroll = (direction: 'left' | 'right') => {
		const container = carouselRef.current
		if (!container) return

		if ((direction === 'left' && isLeftDisabled) || (direction === 'right' && isRightDisabled))
			return

		const cs = getComputedStyle(container)
		const gap = parseFloat(cs.columnGap || cs.gap || '0') || 0

		const page = container.clientWidth + gap

		const dir = direction === 'right' ? 1 : -1
		const max = container.scrollWidth - container.clientWidth
		const target = Math.min(max, Math.max(0, Math.round(container.scrollLeft + dir * page)))

		smoothScrollTo(container, target, 500)
	}

	const updateButtonStates = useCallback(() => {
		const el = carouselRef.current
		if (!el) return
		const { scrollLeft, scrollWidth, clientWidth } = el
		const max = scrollWidth - clientWidth

		const hasOverflow = max > 0
		if (!hasOverflow) {
			setIsLeftDisabled(true)
			setIsRightDisabled(true)
		} else {
			setIsLeftDisabled(scrollLeft <= EPS)
			setIsRightDisabled(scrollLeft >= max - EPS)
		}
	}, [])

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
		const walk = (x - startX) * 2
		carouselRef.current.scrollLeft = scrollLeft - walk
	}

	const handleMouseUp = () => {
		setIsDragging(false)
		setTimeout(updateButtonStates, 100)
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
		setTimeout(updateButtonStates, 100)
	}

	useEffect(() => {
		const el = carouselRef.current
		if (!el) return

		const onScroll = () => updateButtonStates()
		el.addEventListener('scroll', onScroll)
		return () => el.removeEventListener('scroll', onScroll)
	}, [updateButtonStates])

	useLayoutEffect(() => {
		const id = requestAnimationFrame(() => updateButtonStates())
		return () => cancelAnimationFrame(id)
	}, [updateButtonStates, protocolsData?.data?.length, isPending])

	useEffect(() => {
		const el = carouselRef.current
		if (!el) return

		const ro = new ResizeObserver(() => updateButtonStates())
		ro.observe(el)
		return () => ro.disconnect()
	}, [updateButtonStates])

	const handleProtocolClick = (slug: string, id: string) => {
		router.push(`/protocols/${slug}?id=${id}`)
	}

	return (
		<main className={style.wrapper}>
			<div className={style.feature}>
				<h4>Protocols</h4>
				<div className={style.buttons}>
					<CustomButton
						variant="secondary"
						size="icon"
						radius="full"
						className={`${style.button} ${isLeftDisabled ? style.disabled : ''}`}
						onClick={() => handleScroll('left')}
						disabled={isLeftDisabled}
					>
						<span className={style.iconArrowLeft} />
					</CustomButton>
					<CustomButton
						variant="secondary"
						size="icon"
						radius="full"
						className={`${style.button} ${isRightDisabled ? style.disabled : ''}`}
						onClick={() => handleScroll('right')}
						disabled={isRightDisabled}
					>
						<span className={style.iconArrowRight} />
					</CustomButton>
				</div>
			</div>
			{protocolsData?.data?.length === 0 && (
				<div className={style.noProtocols}>
					<p>No protocols found</p>
				</div>
			)}
			{isPending ? (
				<div className={style.skeletonGroup}>
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index} className={style.skeleton} />
					))}
				</div>
			) : (
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
					{protocolsData?.data?.map((protocol, index) => (
						<FeaturedProtocolCard
							key={index}
							protocol={protocol.attributes}
							onClick={() => handleProtocolClick(protocol.attributes.slug, protocol.id)}
						/>
					))}
				</div>
			)}
		</main>
	)
}

export default FeaturedProtocolsCarousel
