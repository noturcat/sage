import { trendingNow } from '@/components/pages/protocols/trending-now'
import style from './MostPopular.module.scss'

/**
 * **Interactive most popular card** with trending content.
 *
 * Displays a most replies card with label and content from trending data.
 * Features responsive design with consistent spacing and typography.
 *
 * Example:
 * ```tsx
 * <MostPopular />
 * ```
 *
 * Notes:
 * - Interactive most popular card with label and content.
 * - Responsive design with consistent spacing and typography.
 * - Modular SCSS styling with conditional class application.
 * - Accessible markup with proper semantic HTML elements.
 */

function MostPopular() {
	return (
		<main className={style.wrapper}>
			<p className={style.label}>Most Popular</p>
			<div className={style.contentGroup}>
				{trendingNow.map(trending => (
					<div key={trending.id} className={style.content}>
						<p className={style.count}>{trending.id}</p>
						<p className={style.title}>{trending.title}</p>
					</div>
				))}
			</div>
		</main>
	)
}

export default MostPopular
