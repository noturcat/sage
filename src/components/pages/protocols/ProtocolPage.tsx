'use client'

import { useRouter } from 'next/navigation'
import FeaturedProtocolsCarousel from '@/components/molecules/carousel/FeaturedProtocolsCarousel'
import TrendingProtocolCard from '@/components/molecules/cards/protocol-card/TrendingProtocolCard'
import CategoriesCarousel from '@/components/molecules/carousel/CategoriesCarousel'
import { Select } from '@/components/atoms/form/select/Select'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useGetProtocols } from '@/app/api/protocols/queries/protocols'
import { filterOptions, sortOptions } from '@/components/pages/protocols/options'
import { useQueryParamStore } from '@/store/QueryParamStore'

import style from './ProtocolPage.module.scss'

/**
 * **Protocol discovery page** with carousel navigation and content sections.
 *
 * Displays featured protocols, trending protocols with category filtering,
 * recommended topics, and user suggestions. Features intelligent carousel
 * navigation with dynamic scroll buttons.
 *
 * Example:
 * ```tsx
 * <ProtocolPage />
 * ```
 *
 * Notes:
 * - Smart carousel with dynamic navigation buttons.
 * - Category-based protocol filtering with sort and filter options.
 * - Responsive design with scroll/resize handling.
 * - Featured and trending protocol sections with organized layout.
 * - Advertisement integration and user follow suggestions.
 * - Query parameter state management for filtering and sorting.
 */

function ProtocolPage() {
	const { sort, filter, setSort, setFilter } = useQueryParamStore()
	const { data: protocolsData, isPending } = useGetProtocols()
	const router = useRouter()

	const handleProtocolClick = (slug: string, id: string) => {
		router.push(`/protocols/${slug}?id=${id}`)
	}

	return (
		<main className={style.container}>
			<FeaturedProtocolsCarousel />
			<CategoriesCarousel />
			<div className={style.titleSortFilter}>
				<h4>Trending Protocols</h4>
				<div className={style.selectOptions}>
					<Select
						placeholder="Filter by"
						radius="full"
						options={filterOptions}
						value={filter}
						onChange={value => setFilter(value ?? '')}
					/>
					<Select
						placeholder="Sort by"
						radius="full"
						options={sortOptions}
						value={sort}
						onChange={value => setSort(value ?? '')}
					/>
				</div>
			</div>
			<div className={style.trendingProtocolsList}>
				{isPending && (
					<div className={style.skeletonGroup}>
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className={style.skeleton} />
						))}
					</div>
				)}
				{protocolsData?.data?.map((protocol, index) => (
					<TrendingProtocolCard
						key={index}
						protocol={protocol.attributes}
						onClick={() => handleProtocolClick(protocol.attributes.slug, protocol.id)}
					/>
				))}
				{protocolsData?.data?.length === 0 && (
					<div className={style.noProtocols}>
						<p>No trending protocols found</p>
					</div>
				)}
			</div>
		</main>
	)
}

export default ProtocolPage
