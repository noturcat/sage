'use client'

import TrendingThreadCard from '@/components/molecules/cards/thread-card/TrendingThreadCard'
import TopThreadsCarousel from '@/components/molecules/carousel/TopThreadsCarousel'
import CategoriesCarousel from '@/components/molecules/carousel/CategoriesCarousel'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { Select } from '@/components/atoms/form/select/Select'
import { useGetThreads } from '@/app/api/threads/queries/threads'
import { filterOptions } from '@/components/pages/threads/options'
import { useQueryParamStore } from '@/store/QueryParamStore'

import style from './ThreadPage.module.scss'

/**
 * **Thread discovery page** with carousel navigation and content sections.
 *
 * Displays featured threads, trending threads with category filtering,
 * recommended topics, and user suggestions. Features intelligent carousel
 * navigation with dynamic scroll buttons.
 *
 * Example:
 * ```tsx
 * <ThreadPage />
 * ```
 *
 * Notes:
 * - Smart carousel with dynamic navigation buttons.
 * - Category-based thread filtering with filter options.
 * - Responsive design with scroll/resize handling.
 * - Featured and trending thread sections with organized layout.
 * - Advertisement integration and user follow suggestions.
 * - Query parameter state management for filtering.
 */

function ThreadPage() {
	const { filter, setFilter } = useQueryParamStore()
	const { data: threadsData, isPending } = useGetThreads()

	return (
		<main className={style.container}>
			<TopThreadsCarousel />
			<CategoriesCarousel />
			<div className={style.titleSortFilter}>
				<h4>Trending Threads</h4>
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
			<div className={style.trendingThreadsList}>
				{isPending && (
					<div className={style.skeletonGroup}>
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className={style.skeleton} />
						))}
					</div>
				)}
				{threadsData?.data?.map(thread => (
					<TrendingThreadCard key={thread.id} threads={thread} />
				))}
				{threadsData?.data?.length === 0 && (
					<div className={style.noThreads}>
						<p>No threads found</p>
					</div>
				)}
			</div>
		</main>
	)
}

export default ThreadPage
