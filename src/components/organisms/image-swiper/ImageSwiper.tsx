'use client'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import Container from '@/components/util/container/Container'
import Image from 'next/image'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'

import 'swiper/css' // base styles
import 'swiper/css/navigation' // optional modules
import 'swiper/css/pagination'
import styles from './ImageSwiper.module.scss'

interface SlideData {
	category?: string
	title?: string
	description?: string
	avatarImage?: string
	authorName?: string
	readingTime?: string
	onClick?: () => void
}

interface ImageSwiperProps {
	images?: string[]
	height?: number
	autoplay?: boolean
	autoplayDelay?: number
	showNavigation?: boolean
	showPagination?: boolean
	showPauseButton?: boolean
	className?: string
	// Pagination customization
	paginationStyle?: 'dots' | 'numbers' | 'progress' | 'moving-dot' | 'indexed-dots' | 'custom'
	paginationPosition?: 'bottom' | 'top' | 'left' | 'right'
	customPaginationContent?: React.ReactNode
	// Dynamic content per slide
	slidesData?: SlideData[]
	// Legacy props for backward compatibility
	category?: string
	title?: string
	description?: string
	avatarImage?: string
	authorName?: string
	readingTime?: string
	onClick?: () => void
}

export default function ImageSwiper({
	images = ['/images/forest2.png', '/images/barn.png', '/images/cows.png'],
	height = 400,
	autoplay = true,
	autoplayDelay = 3000,
	showNavigation = true,
	showPagination = true,
	showPauseButton = true,
	className = '',
	paginationStyle = 'dots',
	paginationPosition = 'bottom',
	customPaginationContent,
	slidesData,
	category,
	title,
	description,
	avatarImage,
	authorName,
	readingTime,
	onClick,
}: ImageSwiperProps) {
	const [hasError, setHasError] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null)
	const [activeSlide, setActiveSlide] = useState(0)
	const [isMoving, setIsMoving] = useState(false)

	const isFirstSlide = activeSlide === 0
	const isLastSlide = activeSlide === images.length - 1

	// Get current slide's data (dynamic content)
	const currentSlideData = slidesData?.[activeSlide] || {
		category,
		title,
		description,
		avatarImage,
		authorName,
		readingTime,
		onClick,
	}
	const handleImageError = () => {
		setHasError(true)
	}

	const handlePauseToggle = () => {
		if (swiperRef) {
			if (isPaused) {
				swiperRef.autoplay.start()
			} else {
				swiperRef.autoplay.stop()
			}
			setIsPaused(!isPaused)
		}
	}

	const handleSlideChange = (swiper: SwiperType) => {
		const newIndex = swiper.realIndex
		if (newIndex !== activeSlide) {
			setIsMoving(true)
			setActiveSlide(newIndex)

			setTimeout(() => {
				setIsMoving(false)
			}, 500)
		}
	}

	const goToSlide = (index: number) => {
		if (swiperRef && index !== activeSlide) {
			setIsMoving(true)
			swiperRef.slideTo(index)

			setTimeout(() => {
				setIsMoving(false)
			}, 500)
		}
	}

	const renderPagination = () => {
		if (!showPagination) return null

		if (customPaginationContent) {
			return <div className={styles.customPagination}>{customPaginationContent}</div>
		}

		const paginationClass = `${styles.pagination} ${styles[paginationPosition]} ${styles[paginationStyle]}`

		const getMovingDotStyle = () => {
			if (paginationStyle !== 'moving-dot') return {}

			const totalSlides = images.length
			const progress = totalSlides > 1 ? activeSlide / (totalSlides - 1) : 0
			const leftPosition = 20 + progress * (100 - 40) // 20px padding + progress * available width

			return {
				'--moving-dot-left': `${leftPosition}%`,
			} as React.CSSProperties
		}

		const totalSlides = images.length
		const activeSlideIsLeft = activeSlide < totalSlides / 2

		const getDotPosition = (index: number) => {
			if (index === activeSlide) return 'active'
			if (index < activeSlide) return 'left'
			if (index > activeSlide) return 'right'
			return 'none'
		}

		return (
			<div
				className={`${paginationClass} ${activeSlideIsLeft ? styles.leftActive : styles.rightActive} ${isMoving ? styles.moving : ''}`}
				style={getMovingDotStyle()}
			>
				{images.map((_, index) => {
					const isActive = index === activeSlide
					const dotPosition = getDotPosition(index)

					if (paginationStyle === 'numbers') {
						return (
							<button
								key={index}
								className={`${styles.paginationNumber} ${isActive ? styles.active : ''} ${styles[dotPosition]} ${isMoving ? styles.moving : ''}`}
								onClick={() => goToSlide(index)}
							>
								{index + 1}
							</button>
						)
					}

					if (paginationStyle === 'progress') {
						return (
							<div key={index} className={styles.progressBar}>
								<div
									className={`${styles.progressFill} ${isActive ? styles.active : ''} ${styles[dotPosition]} ${isMoving ? styles.moving : ''}`}
								/>
							</div>
						)
					}

					if (paginationStyle === 'moving-dot') {
						return (
							<button
								key={index}
								className={`${styles.paginationDot} ${isActive ? styles.active : ''} ${styles[dotPosition]} ${isMoving ? styles.moving : ''}`}
								onClick={() => goToSlide(index)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						)
					}

					if (paginationStyle === 'indexed-dots') {
						return (
							<button
								key={index}
								className={`${styles.paginationIndexedDot} ${isActive ? styles.active : ''} ${styles[dotPosition]} ${isMoving ? styles.moving : ''}`}
								onClick={() => goToSlide(index)}
								aria-label={`Go to slide ${index + 1}`}
							>
								<span className={styles.dotIndex}>{index + 1}</span>
							</button>
						)
					}

					return (
						<button
							key={index}
							className={`${styles.paginationDot} ${isActive ? styles.active : ''} ${styles[dotPosition]} ${isMoving ? styles.moving : ''}`}
							onClick={() => goToSlide(index)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					)
				})}
			</div>
		)
	}

	if (hasError) {
		return (
			<div className={`${styles.imageSwiper} ${styles.error} ${className}`} style={{ height }}>
				Failed to load images
			</div>
		)
	}

	return (
		<div className={styles.imageSwiperWrapper}>
			<div className={`${styles.imageSwiper} ${styles.fadeIn} ${className}`} style={{ height }}>
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					navigation={false}
					pagination={false}
					autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
					loop={images.length > 1}
					spaceBetween={0}
					slidesPerView={1}
					className={styles.swiper}
					onSwiper={setSwiperRef}
					onSlideChange={handleSlideChange}
				>
					{images.map((src, i) => {
						return (
							<SwiperSlide key={i}>
								<div className={styles.imageContainer} onClick={currentSlideData.onClick}>
									<Image
										src={src}
										alt={`Slide ${i + 1}`}
										fill
										className={styles.image}
										onError={handleImageError}
										priority={i === 0}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw, (max-height: 768px) 100vw, (max-height: 1200px) 50vw, 33vw"
									/>
								</div>
							</SwiperSlide>
						)
					})}
				</Swiper>
				<Container>
					<div className={styles.controlsContainer}>
						{showNavigation && (
							<>
								{isFirstSlide && (
									<ButtonIcon
										icon="/icons/transparent-arrow-left.svg"
										variant="text"
										styleType="icon"
										size={50}
										extraClass={styles.cursorDefault}
									/>
								)}
								{!isFirstSlide && (
									<ButtonIcon
										icon="/icons/transparent-arrow-right.svg"
										variant="text"
										styleType="icon"
										size={50}
										onClick={() => swiperRef?.slidePrev()}
										extraClass={styles.rotate180}
									/>
								)}
								{!isLastSlide && (
									<ButtonIcon
										icon="/icons/transparent-arrow-right.svg"
										variant="text"
										styleType="icon"
										onClick={() => swiperRef?.slideNext()}
										size={50}
									/>
								)}
								{isLastSlide && (
									<ButtonIcon
										icon="/icons/transparent-arrow-left.svg"
										variant="text"
										styleType="icon"
										size={50}
										extraClass={styles.rotate180 + ' ' + styles.cursorDefault}
									/>
								)}
								{showPauseButton && autoplay && (
									<div
										onClick={handlePauseToggle}
										className={styles.pauseButton}
										aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
									>
										{isPaused ? (
											<ButtonIcon
												icon="/icons/play.svg"
												variant="text"
												styleType="icon"
												size={50}
											/>
										) : (
											<ButtonIcon
												icon="/icons/pause.svg"
												variant="text"
												styleType="icon"
												size={50}
											/>
										)}
									</div>
								)}
							</>
						)}
					</div>
				</Container>
			</div>
			<div className={styles.textOverlay}>
				<div className={styles.textOverlayContent}>
					<div className={styles.textContent}>
						<div className={styles.categoryTag}>{currentSlideData.category}</div>
						<h1 className={styles.title}>{currentSlideData.title}</h1>
						<p className={styles.description}>{currentSlideData.description}</p>
						{renderPagination()}
					</div>
					<div className={styles.rightContent}>
						<div className={styles.authorInfo}>
							<div className={styles.authorAvatar}>
								<Image
									src={currentSlideData.avatarImage || '/images/avatar-placeholder.png'}
									alt="author avatar"
									width={48}
									height={48}
									className={styles.avatarImage}
								/>
							</div>
							<div className={styles.authorDetails}>
								<div className={styles.authorName}>{currentSlideData.authorName}</div>
							</div>
						</div>
						<div className={styles.readingTime}>{currentSlideData.readingTime}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
