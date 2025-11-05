import style from './Pill.module.scss'

/**
 * **Flexible pill** for status, categories, or labels.
 *
 * Supports multiple visual variants and border radius options with accessibility features.
 * Built with WCAG compliance and proper focus states.
 *
 * Example:
 * ```tsx
 * <Pill variant="secondary" radius="full">
 *   Category
 * </Pill>
 * ```
 *
 * Notes:
 * - Multiple variants: primary, secondary, danger, outline.
 * - Border radius options from sm to full.
 * - Includes hover states and keyboard navigation.
 */

interface VariantProps {
	variant?: 'primary' | 'secondary' | 'danger' | 'outline'
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

function Pill({
	variant = 'primary',
	radius = 'md',
	asChild = false,
	className,
	...props
}: React.HTMLAttributes<HTMLElement> & VariantProps & { asChild?: boolean }) {
	const Comp = asChild ? 'div' : 'span'
	const classes = `
    ${style.pill}
    ${style[`variant--${variant}`]}
    ${style[`radius--${radius}`]}
    ${asChild ? style.interactive : ''}
    ${className}
  `
	return <Comp data-slot="pill" className={classes} {...props} />
}

export default Pill
