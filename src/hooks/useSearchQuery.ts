'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * useSearchQuery - A custom hook for managing search query state with URL synchronization and debouncing
 *
 * @description
 * A powerful search state management hook that automatically synchronizes search queries with URL parameters
 * and provides debounced updates to prevent excessive URL changes. Maintains search state across page refreshes
 * and browser navigation while ensuring optimal performance through configurable debouncing.
 *
 * @features
 * - URL parameter synchronization (reads from and writes to 'search' param)
 * - Configurable debounce delay to prevent excessive URL updates
 * - Automatic state initialization from current URL parameters
 * - Clean URL management (removes empty search params)
 * - Memory leak prevention with timeout cleanup
 * - TypeScript support with proper return type inference
 * - Next.js App Router compatibility
 * - Browser navigation state preservation
 * - Real-time search state updates
 *
 * @example
 * ```tsx
 * // Basic usage with default 300ms debounce
 * const [search, setSearch] = useSearchQuery()
 *
 * // Custom debounce delay
 * const [search, setSearch] = useSearchQuery(500)
 *
 * // In a search component
 * function SearchComponent() {
 *   const [search, setSearch] = useSearchQuery(200)
 *
 *   return (
 *     <input
 *       value={search}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   )
 * }
 *
 * // Fast search for real-time filtering
 * const [query, setQuery] = useSearchQuery(100)
 *
 * // Slower search for API calls
 * const [apiSearch, setApiSearch] = useSearchQuery(800)
 * ```
 *
 * @param delay - Debounce delay in milliseconds (default: 300)
 *
 * @returns A tuple containing:
 * - [0] search: Current search query string
 * - [1] setSearch: Function to update the search query
 *
 * @behavior
 * - On mount: Reads 'search' parameter from current URL and initializes state
 * - On search change: Debounces update and modifies URL after specified delay
 * - On empty search: Removes 'search' parameter from URL for clean URLs
 * - On unmount: Cleans up pending timeout to prevent memory leaks
 * - On navigation: Preserves search state across browser back/forward
 *
 * @performance
 * - Debounced URL updates prevent excessive browser history entries
 * - Timeout cleanup prevents memory leaks in fast component mounting/unmounting
 * - Efficient URL parameter management with URLSearchParams API
 * - Optimized for frequent search input changes
 *
 * @dependencies
 * - Next.js useSearchParams for reading URL parameters
 * - Next.js useRouter for URL navigation
 * - React useState for local state management
 * - React useEffect for side effects and cleanup
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-search-params} Next.js useSearchParams
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router} Next.js useRouter
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams} URLSearchParams API
 *
 * @since 1.0.0
 * @author Christian
 * @version 1.0.0
 */

export const useSearchQuery = (delay: number = 300) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('search')
  const [search, setSearch] = useState(query || '')

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if (search.trim()) {
        params.set('search', search.trim())
      } else {
        params.delete('search')
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
      router.replace(newUrl)
    }, delay)

    return () => clearTimeout(handler)
  }, [search, delay, searchParams, router])

  return [search, setSearch] as const
}
