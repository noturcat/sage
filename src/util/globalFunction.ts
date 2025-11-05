export const formatIsoToDDMonYYYY = (isoDateString: string) => {
	if (!isoDateString) {
		return ''
	}

	const date = new Date(isoDateString)

	if (isNaN(date.getTime())) {
		console.error(`Invalid date string provided: ${isoDateString}`)
		return ''
	}

	const day = date.getDate()
	const year = date.getFullYear()

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]
	const month = monthNames[date.getMonth()]
	return `${day} ${month} ${year}`
}

export const stripHtmlAndLimitCharacters = (htmlString: string, maxLength: number) => {
	if (!htmlString) {
		return ''
	}

	const tempDiv = document.createElement('div')
	tempDiv.innerHTML = htmlString
	let plainText = tempDiv.textContent || tempDiv.innerText || ''

	if (plainText.length > maxLength) {
		plainText = plainText.substring(0, maxLength) + '...'
	}

	return plainText
}

/**
 * **Time elapsed utility** for displaying relative time since creation.
 *
 * Computes and formats the time elapsed since a given ISO date string.
 * Returns human-readable relative time (e.g., "1 minute ago", "2 hours ago").
 *
 * @param {string} isoDateString - ISO date string (e.g., "2025-09-30T04:28:01+08:00")
 * @returns {string} Formatted relative time string
 *
 * Example:
 * ```tsx
 * const timeAgo = getTimeElapsed("2025-09-30T04:28:01+08:00");
 * // Returns: "2 hours ago" or "1 minute ago" etc.
 * ```
 */
export const getTimeElapsed = (isoDateString: string, compact: boolean = false): string => {
	if (!isoDateString) {
		return ''
	}

	const now = new Date()
	const createdDate = new Date(isoDateString)

	if (isNaN(createdDate.getTime())) {
		console.error(`Invalid date string provided: ${isoDateString}`)
		return ''
	}

	const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

	// Handle future dates
	if (diffInSeconds < 0) {
		return 'just now'
	}

	// Less than 1 minute
	if (diffInSeconds < 60) {
		if (compact) {
			return diffInSeconds <= 1 ? '1s' : `${diffInSeconds}s`
		}
		return diffInSeconds <= 1 ? '1 second ago' : `${diffInSeconds} seconds ago`
	}

	// Less than 1 hour
	const diffInMinutes = Math.floor(diffInSeconds / 60)
	if (diffInMinutes < 60) {
		if (compact) {
			return diffInMinutes === 1 ? '1m' : `${diffInMinutes}m`
		}
		return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
	}

	// Less than 1 day
	const diffInHours = Math.floor(diffInMinutes / 60)
	if (diffInHours < 24) {
		if (compact) {
			return diffInHours === 1 ? '1h' : `${diffInHours}h`
		}
		return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
	}

	// Less than 1 week
	const diffInDays = Math.floor(diffInHours / 24)
	if (diffInDays < 7) {
		if (compact) {
			return diffInDays === 1 ? '1d' : `${diffInDays}d`
		}
		return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
	}

	// Less than 1 month (30 days)
	if (diffInDays < 30) {
		const diffInWeeks = Math.floor(diffInDays / 7)
		if (compact) {
			return diffInWeeks === 1 ? '1w' : `${diffInWeeks}w`
		}
		return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`
	}

	// Less than 1 year
	const diffInMonths = Math.floor(diffInDays / 30)
	if (diffInMonths < 12) {
		if (compact) {
			return diffInMonths === 1 ? '1mo' : `${diffInMonths}mo`
		}
		return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`
	}

	// 1 year or more
	const diffInYears = Math.floor(diffInDays / 365)
	if (compact) {
		return diffInYears === 1 ? '1y' : `${diffInYears}y`
	}
	return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`
}

// ... existing code ...

/**
 * **Format ISO date to readable long date** with day of week.
 *
 * Converts ISO date string to human-readable format: "Thursday, 23 January 2025"
 *
 * @param {string} isoDateString - ISO date string (e.g., "2025-10-01T23:44:07+08:00")
 * @returns {string} Formatted date string with day of week, day, month, and year
 *
 * Example:
 * ```tsx
 * const formattedDate = formatIsoToLongDate("2025-10-01T23:44:07+08:00");
 * // Returns: "Wednesday, 1 October 2025"
 * ```
 */
export const formatIsoToLongDate = (isoDateString: string): string => {
	if (!isoDateString) {
		return ''
	}

	const date = new Date(isoDateString)

	if (isNaN(date.getTime())) {
		console.error(`Invalid date string provided: ${isoDateString}`)
		return ''
	}

	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const dayOfWeek = dayNames[date.getDay()]
	const day = date.getDate()
	const month = monthNames[date.getMonth()]
	const year = date.getFullYear()

	return `${dayOfWeek}, ${day} ${month} ${year}`
}
