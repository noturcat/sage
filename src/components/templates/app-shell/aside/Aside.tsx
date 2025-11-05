import AdvertisementGroup from '@/components/molecules/advertisement-group/Advertisement-group'
import WhoToFollow from '@/components/molecules/who-to-follow/WhoToFollow'
import RecommendedTopics from '@/components/molecules/cards/recommended-topics-card/RecommendedTopics'
import TrendingNowCard from '@/components/molecules/cards/protocol-card/TrendingNowCard'
import MostReplies from '@/components/molecules/cards/thread-card/MostReplies'
import MostPopular from '@/components/molecules/cards/discovery-card/MostPopular'
import { topics } from '@/components/pages/protocols/topics'
import { useLayout } from '@/hooks/useLayout'

import style from './Aside.module.scss'

/**
 * **Aside component** for displaying various content sections in the app shell.
 *
 * Provides a flexible layout for displaying sponsored advertisements, trending protocols,
 * most replies, who to follow, and recommended topics.
 *
 * Example:
 *
 * ```tsx
 * <Aside />
 * ```
 *
 * Notes:
 * - Displays sponsored advertisements if showSponsored is true.
 * - Displays trending protocols if showTrendingNow is true.
 * - Displays most replies if showMostReplies is true.
 * - Displays most popular if showMostPopular is true.
 * - Displays who to follow if showWhoToFollow is true.
 * - Displays recommended topics if showRecommendedTopics is true.
 */

function Aside() {
	const layout = useLayout()

	return (
		<section className={style.aside}>
			{layout.showSponsored && <AdvertisementGroup />}
			{layout.showTrendingNow && <TrendingNowCard />}
			{layout.showMostReplies && <MostReplies />}
			{layout.showMostPopular && <MostPopular />}
			{layout.showWhoToFollow && <WhoToFollow />}
			{layout.showRecommendedTopics && <RecommendedTopics topics={topics} />}
		</section>
	)
}

export default Aside
