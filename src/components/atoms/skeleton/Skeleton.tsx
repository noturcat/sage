import style from './Skeleton.module.scss'

/**
 * **Skeleton loading placeholder** with configurable radius.
 *
 * Displays a loading placeholder with pulse animation and configurable border radius.
 * Features multiple radius options and extends standard div props.
 *
 * Example:
 * ```tsx
 * <Skeleton radius="lg" className="my-skeleton" />
 * ```
 *
 * Notes:
 * - Configurable border radius from sm to full.
 * - Pulse animation for loading indication.
 * - Extends standard div props for flexibility.
 * - Uses CSS custom properties for consistent styling.
 */

interface SkeletonProps extends React.ComponentProps<'div'> {
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

function Skeleton({ radius = 'md', className = '', ...props }: SkeletonProps) {
  const classes = `
    ${style.skeleton}  
    ${style[`radius--${radius}`]} 
    ${className}
  `
  return <div data-slot="skeleton" className={classes} {...props} />
}

export default Skeleton
