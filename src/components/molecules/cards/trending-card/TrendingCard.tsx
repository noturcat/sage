import Image from 'next/image'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './TrendingCard.module.scss'

/**
 * **Flexible trending card** with dual layout support.
 *
 * Versatile card component that displays content in both horizontal and vertical layouts.
 * Features background image with optional overlay, category badge, and flexible content area.
 *
 * Example:
 * ```tsx
 * <TrendingCard
 *   variant="horizontal"
 *   image="/images/article.jpg"
 *   category="Health & Wellness"
 *   overlay={true}
 * >
 *   <h3>Article Title</h3>
 *   <p>Article description...</p>
 * </TrendingCard>
 * ```
 *
 * Notes:
 * - Dual layout support: horizontal and vertical variants.
 * - Dynamic background image with CSS custom properties.
 * - Optional gradient overlay for better text readability.
 * - Category badge with icon for content categorization.
 * - Flexible content area for any child components.
 */

interface TrendingCardProps {
	variant?: 'horizontal' | 'vertical'
	image?: string | null
	overlay?: boolean
	category?: string
	children?: React.ReactNode
	withBorder?: boolean
	onClick?: () => void
}

function TrendingCard({
	image = '/images/jh-template-1.png',
	overlay = false,
	category,
	children,
	variant = 'horizontal',
	withBorder = true,
	onClick,
}: TrendingCardProps) {
	return (
		<article
			className={style.card}
			data-variant={variant}
			data-with-border={withBorder}
			onClick={onClick}
		>
			<section
				className={style.image}
				style={{ '--image-url': `url(${image})` } as React.CSSProperties}
				data-overlay={overlay}
				data-variant={variant}
			>
				{category && (
					<CustomButton radius="full" variant="secondary" size="sm" className={style.button}>
						<span className={style.category}>{category}</span>
						<Image src="/icons/arrow-slant.svg" alt="Arrow Slant" width={10} height={10} />
					</CustomButton>
				)}
			</section>
			<section className={style.wrapper} data-variant={variant}>
				{children}
			</section>
		</article>
	)
}

export default TrendingCard
