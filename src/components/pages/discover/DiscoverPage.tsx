'use client'

import { useRouter } from 'next/navigation'
import ImageSwiper from '@/components/organisms/image-swiper/ImageSwiper'
import TrendingDiscoveriesCard from '@/components/molecules/cards/discovery-card/TrendingDiscoveriesCard'
import CategoriesCarousel from '@/components/molecules/carousel/CategoriesCarousel'
import { Select } from '@/components/atoms/form/select/Select'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { filterOptions } from '@/components/pages/protocols/options'
import { useQueryParamStore } from '@/store/QueryParamStore'
import { useGetDiscovers } from '@/app/api/discoveries/queries/discovers'

import style from './DiscoverPage.module.scss'

/**
 * **Protocol discovery page** with carousel navigation and content sections.
 *
 * Displays featured protocols, trending protocols with category filtering,
 * recommended topics, and user suggestions. Features intelligent carousel
 * navigation with dynamic scroll buttons.
 *
 * Example:
 * ```tsx
 * <DiscoverPage />
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

function DiscoverPage() {
	const { filter, setFilter } = useQueryParamStore()
	const router = useRouter()
	const { data: discoveries, isPending } = useGetDiscovers()

	const handleClick = (id: string, slug: string) => {
		router.push(`/discover/${slug}?id=${id}`)
	}

	return (
		<main className={style.wrapper}>
			{isPending && <Skeleton className={style.skeleton} />}

			{/* Single ImageSwiper with all discovery data */}
			{discoveries?.data && discoveries.data.length > 0 && (
				<ImageSwiper
					images={discoveries.data.map(discovery =>
						discovery.attributes.featured_image?.url
							? discovery.attributes.featured_image?.url
							: '/images/jh-template-1.png'
					)}
					slidesData={discoveries.data.map(discovery => ({
						category: discovery.attributes.primary_category?.name,
						title: discovery.attributes.title,
						description: discovery.attributes.summary,
						avatarImage: '/images/avatar-placeholder.png',
						authorName:
							(discovery.attributes.author?.first_name ?? '') +
							' ' +
							(discovery.attributes.author?.last_name ?? ''),
						readingTime: discovery.attributes.average_reading_time,
						onClick: () => handleClick(discovery.id.toString(), discovery.attributes.slug),
					}))}
					paginationStyle="moving-dot"
				/>
			)}

			{discoveries?.data?.length === 0 && (
				<div className={style.noDiscoveries}>
					<p>No discoveries found</p>
				</div>
			)}
			<CategoriesCarousel />
			<div className={style.titleSortFilter}>
				<h4>Trending Discoveries</h4>
				<div className={style.selectOptions}>
					<Select
						placeholder="Filter by"
						radius="full"
						options={filterOptions}
						value={filter}
						onChange={value => setFilter(value ?? '')}
					/>
				</div>
			</div>
			<div className={style.trendingDiscoveriesList}>
				{isPending && (
					<div className={style.skeletonGroup}>
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className={style.skeleton} />
						))}
					</div>
				)}
				{discoveries?.data?.map(discover => (
					<div key={discover.id} className={style.discoveryCard}>
						<TrendingDiscoveriesCard discoveries={discover} />
					</div>
				))}
				{discoveries?.data?.length === 0 && (
					<div className={style.noTrending}>
						<p>No discoveries found</p>
					</div>
				)}
			</div>
		</main>
	)
}

export default DiscoverPage
