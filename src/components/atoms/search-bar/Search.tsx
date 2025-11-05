'use client'

import { Input } from '@/components/atoms/input/Input'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import style from './Search.module.scss'

/**
 * Search - A smart search input component with URL synchronization and clear functionality
 *
 * @description
 * A specialized search component that automatically synchronizes search queries with URL parameters
 * and provides an intuitive clear functionality. Built on top of the Input component with enhanced
 * search-specific features and state management.
 *
 * @features
 * - URL query parameter synchronization via useSearchQuery hook
 * - Automatic state management with debounced search
 * - Dynamic icon switching (search icon → clear icon when typing)
 * - Click-to-clear functionality with instant feedback
 * - Full border radius for modern search aesthetic
 * - Client-side rendering for optimal interactivity
 * - Accessible search input with proper ARIA attributes
 * - CSS Modules for scoped styling
 * - Real-time search value updates
 *
 * @example
 * ```tsx
 * // Basic usage - automatically syncs with URL
 * <Search />
 *
 * // In a search page layout
 * <div className="search-container">
 *   <h2>Find Protocols</h2>
 *   <Search />
 *   <SearchResults />
 * </div>
 *
 * // With custom container styling
 * <section className="protocol-search">
 *   <Search />
 * </section>
 * ```
 *
 * @behavior
 * - On mount: Reads search query from URL parameters
 * - On input: Updates both local state and URL parameters
 * - On clear: Resets search to empty string and updates URL
 * - Icon state: Shows search icon when empty, clear icon when has value
 * - URL sync: Maintains search state across page refreshes and navigation
 *
 * @dependencies
 * - Input component for base input functionality
 * - useSearchQuery hook for URL synchronization
 * - Search.module.scss for component styling
 *
 * @returns JSX.Element - Rendered search component with dynamic icons
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/searchbox/} ARIA Searchbox Pattern
 * @see {@link https://ux.stackexchange.com/questions/38849/search-box-clear-button} Search UX Best Practices
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search} MDN Search Input
 *
 * @since 1.0.0
 * @author Christian
 * @version 1.0.0
 */

function Search() {
	const [search, setSearch] = useSearchQuery()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const handleClear = () => {
		setSearch('')
	}

	return (
		<main className={style.search}>
			<Input
				type="search"
				radius="full"
				placeholder="Search here..."
				value={search}
				onChange={handleChange}
				rightIcon={
					search ? (
						<span className={style.iconX} onClick={handleClear} />
					) : (
						<span className={style.iconSearch} />
					)
				}
			/>
		</main>
	)
}

export default Search
