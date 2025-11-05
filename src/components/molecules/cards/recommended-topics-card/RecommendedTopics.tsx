import Pill from '@/components/atoms/pill/Pill'
import style from './RecommendedTopics.module.scss'

/**
 * **Interactive topic discovery** component with pill-based navigation.
 *
 * Displays recommended topics as clickable pill-shaped elements in a responsive grid layout.
 * Features outline variant styling and accessible interaction patterns for topic selection.
 *
 * Example:
 * ```tsx
 * <RecommendedTopics topics={topics} />
 * ```
 *
 * Notes:
 * - Responsive pill-based topic display with outline variant styling.
 * - Full border radius for modern, rounded pill appearance.
 * - Flexible grid layout that adapts to different screen sizes.
 * - Semantic HTML structure with proper heading hierarchy.
 * - Accessible interaction patterns for topic selection.
 */

interface Topic {
	id: number
	name: string
}

interface RecommendedTopicsProps {
	topics: Topic[]
}

function RecommendedTopics({ topics }: RecommendedTopicsProps) {
	return (
		<main className={style.recommendedTopics}>
			<h6>Recommended Topics</h6>
			<div className={style.topicGroup}>
				{topics.map(topic => (
					<Pill key={topic.id} variant="outline" radius="full" className={style.topic}>
						{topic.name}
					</Pill>
				))}
			</div>
		</main>
	)
}

export default RecommendedTopics
