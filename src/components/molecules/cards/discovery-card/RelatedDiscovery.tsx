import TrendingDiscoveriesCard from './TrendingDiscoveriesCard'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useGetDiscovers } from '@/app/api/discoveries/queries/discovers'

import style from './RelatedDiscovery.module.scss'

function RelatedDiscovery() {
	const { data: discoveries, isPending } = useGetDiscovers()
	return (
		<main className={style.related}>
			<h4 className={style.label}>Related Discoveries</h4>

			{isPending ? (
				<div className={style.skeletonGroup}>
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index} className={style.skeleton} />
					))}
				</div>
			) : (
				<div className={style.discoveries}>
					{discoveries?.data?.slice(0, 4).map(discovery => (
						<TrendingDiscoveriesCard
							key={discovery.id}
							variant="vertical"
							discoveries={discovery}
						/>
					))}
				</div>
			)}
		</main>
	)
}

export default RelatedDiscovery
