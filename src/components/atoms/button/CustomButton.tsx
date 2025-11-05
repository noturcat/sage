import style from './CustomButton.module.scss'
import React from 'react'

/**
 * **Flexible button** with multiple variants and accessibility features.
 *
 * Supports various visual styles, border radius options, and keyboard navigation.
 * Built with WCAG compliance and proper focus states.
 *
 * Example:
 * ```tsx
 * <CustomButton variant="primary" radius="full">
 *   Click me
 * </CustomButton>
 * ```
 *
 * Notes:
 * - Multiple variants: primary, secondary, danger, outline, text, link.
 * - Border radius options from sm to full.
 * - Includes icon support and hover states.
 */

interface VariantProps {
	variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'text' | 'link'
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
	size?: 'sm' | 'md' | 'lg' | 'icon'
}

function CustomButton({
	variant = 'primary',
	radius = 'md',
	size = 'md',
	className = '',
	children,
	...props
}: React.ComponentProps<'button'> & VariantProps) {
	// Simple check for SVG icons
	const hasIcon = React.Children.toArray(children).some(
		child => React.isValidElement(child) && child.type === 'svg'
	)

	const classes = `
		${style.button}
		${style[`button--${variant}`]}
		${style[`button--${size}`]}
		${style[`button--${radius}`]}
		${hasIcon ? style.hasIcon : ''}
		${className}
	`

	return (
		<button data-slot="button" className={classes} {...props}>
			{children}
		</button>
	)
}

export default CustomButton
