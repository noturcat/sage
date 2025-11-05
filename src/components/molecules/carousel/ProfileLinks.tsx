'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import style from './ProfileLinks.module.scss'

/**
 * **Responsive profile navigation links** with drag scroll functionality.
 *
 * Interactive navigation component that displays profile links in a responsive container.
 * Automatically becomes scrollable when content overflows via CSS overflow-x: auto.
 * Includes drag scroll support for better mobile experience.
 *
 * Example:
 * ```tsx
 * <ProfileLinks links={profileLinks} activeLink="timeline" />
 * ```
 *
 * Notes:
 * - CSS automatically handles overflow behavior with overflow-x: auto.
 * - Drag scroll support for mouse and touch interactions.
 * - Click-to-select link highlighting with active state.
 * - Simple link navigation without custom click handlers.
 */

export interface ProfileLink {
	id: string
	label: string
	path?: string
}

interface ProfileLinksProps {
	links: ProfileLink[]
	activeLink?: string
}

function ProfileLinks({ links, activeLink }: ProfileLinksProps) {
	const carouselRef = useRef<HTMLDivElement>(null)
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

	return (
		<nav className={style.wrapper}>
			<div
				className={`${style.links} ${isDragging ? style.dragging : ''}`}
				ref={carouselRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{links.map(link => (
					<Link
						key={link.id}
						href={link.path ?? '#'}
						className={activeLink === link.id ? style.active : style.item}
					>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	)
}

export default ProfileLinks
