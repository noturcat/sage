'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import style from './FilterGroup.module.scss'

function FilterGroup() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const activeFilter = searchParams.get('filter')

	const filters = [
		{
			label: 'Everyone',
			value: 'everyone',
			onClick: () => {
				const params = new URLSearchParams(searchParams.toString())
				params.set('filter', 'everyone')
				router.replace(`${pathname}?${params.toString()}`, { scroll: false })
			},
		},
		{
			label: 'Following',
			value: 'following',
			onClick: () => {
				const params = new URLSearchParams(searchParams.toString())
				params.set('filter', 'following')
				router.replace(`${pathname}?${params.toString()}`, { scroll: false })
			},
		},
	]
	return (
		<main className={style.filters}>
			{filters.map(filter => (
				<section
					key={filter.value}
					data-active={filter.value === activeFilter}
					className={style.value}
					onClick={filter.onClick}
				>
					<span className={style.label}>{filter.label}</span>
				</section>
			))}
		</main>
	)
}

export default FilterGroup
