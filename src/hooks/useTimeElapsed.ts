import { useState, useEffect } from 'react'
import { getTimeElapsed } from '@/util/globalFunction'

/**
 * **Real-time time elapsed hook** for components that need live updates.
 *
 * Returns the current time elapsed since a given ISO date string,
 * automatically updating at appropriate intervals for smooth UX.
 *
 * @param {string} isoDateString - ISO date string
 * @returns {string} Current formatted relative time string
 *
 * Example:
 * ```tsx
 * const timeAgo = useTimeElapsed("2025-09-30T04:28:01+08:00");
 * // Updates automatically: "1 minute ago" → "2 minutes ago"
 * ```
 */
export const useTimeElapsed = (initialValue: string = '') => {
	const [currentDate, setCurrentDate] = useState(initialValue)
	const [timeElapsed, setTimeElapsed] = useState(() => getTimeElapsed(initialValue))

	const updateTimeElapsed = (isoDateString: string) => {
		setCurrentDate(isoDateString)
		setTimeElapsed(getTimeElapsed(isoDateString))
	}

	useEffect(() => {
		if (!currentDate) return

		const updateTime = () => {
			setTimeElapsed(getTimeElapsed(currentDate))
		}

		// Update immediately
		updateTime()

		// Set up interval based on how recent the date is
		const now = new Date()
		const createdDate = new Date(currentDate)
		const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

		let interval: NodeJS.Timeout

		if (diffInSeconds < 60) {
			// Update every second for the first minute
			interval = setInterval(updateTime, 1000)
		} else if (diffInSeconds < 3600) {
			// Update every minute for the first hour
			interval = setInterval(updateTime, 60000)
		} else if (diffInSeconds < 86400) {
			// Update every hour for the first day
			interval = setInterval(updateTime, 3600000)
		} else {
			// Update daily for older posts
			interval = setInterval(updateTime, 86400000)
		}

		return () => clearInterval(interval)
	}, [currentDate])

	return { timeElapsed, updateTimeElapsed }
}
