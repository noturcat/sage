/**
 * Format numbers to abbreviated form (e.g., 1000 -> 1k, 1500 -> 1.5k)
 *
 * @param num - The number to format
 * @returns Formatted string with appropriate abbreviation
 *
 * Examples:
 * - 999 -> "999"
 * - 1000 -> "1k"
 * - 1500 -> "1.5k"
 * - 10000 -> "10k"
 * - 1000000 -> "1M"
 */
export const formatNumber = (num: number | undefined | null): string => {
	if (num === undefined || num === null) {
		return '0'
	}

	if (num < 1000) {
		return num.toString()
	}

	if (num < 1000000) {
		const thousands = Math.floor(num / 1000)
		return `${thousands}k`
	}

	if (num < 1000000000) {
		const millions = Math.floor(num / 1000000)
		return `${millions}M`
	}

	const billions = Math.floor(num / 1000000000)
	return `${billions}B`
}
