/**
 * Utility functions to format AI responses for better visual display
 */

import type { SearchItem } from '@/components/organisms/global-search/GlobalSearch.types'

export function formatAIResponse(text: string, sources?: SearchItem[]): string {
	let formattedText = text

	formattedText = convertNumberedListsToHTML(formattedText)

	formattedText = convertBoldText(formattedText)

	formattedText = convertProtocolTitles(formattedText)

	formattedText = convertSuggestedLinks(formattedText, sources)

	formattedText = convertMarkdownLinks(formattedText, sources)

	formattedText = convertBoldTextToLinks(formattedText, sources)

	formattedText = convertKeyPhrasesToLinks(formattedText, sources)

	formattedText = formattedText.replace(/\n(?![^<]*>)/g, '<br>')

	return formattedText
}

function convertNumberedListsToHTML(text: string): string {
	const lines = text.split('\n')
	let result = ''
	let i = 0

	while (i < lines.length) {
		const line = lines[i].trim()

		const numberedMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/)

		if (numberedMatch) {
			const listItems: string[] = []
			let j = i
			let stepNumber = 1

			while (j < lines.length) {
				const currentLine = lines[j].trim()
				const currentMatch = currentLine.match(/^(\d+)[\.\)]\s+(.+)$/)

				if (currentMatch) {
					const stepNum = parseInt(currentMatch[1]) || stepNumber
					listItems.push(`<li data-step="${stepNum}">${currentMatch[2]}</li>`)
					stepNumber++
					j++
				} else {
					break
				}
			}

			if (listItems.length > 0) {
				result += `<ol class="step-list">${listItems.join('')}</ol>`
			}

			i = j
		} else {
			// Regular line, add as is
			result += line + '\n'
			i++
		}
	}

	return result
}

function convertBoldText(text: string): string {
	return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function convertProtocolTitles(text: string): string {
	return text.replace(/^([^:]+:)\s*$/gm, '<h3>$1</h3>')
}

function convertSuggestedLinks(text: string, sources?: SearchItem[]): string {
	// Match the pattern "Suggested: [Link Text](URL)" and convert to styled HTML
	const suggestedLinkRegex = /Suggested:\s*\[([^\]]+)\]\(([^)]+)\)/g

	// Also match simple "Suggested: Text" format without brackets
	const simpleSuggestedRegex = /Suggested:\s*([^\n\r]+)/g

	let result = text.replace(suggestedLinkRegex, (match, linkText, url) => {
		// Generate appropriate URL based on content type and available sources
		const mappedUrl = mapContentTypeToUrl(linkText, url, sources)
		return ` <a href="${mappedUrl}" target="_blank" rel="noopener noreferrer" class="suggested-link-text" style="color: var(--jh-green-04);">${linkText}</a>`
	})

	// Handle simple "Suggested: Text" format
	result = result.replace(simpleSuggestedRegex, (match, linkText) => {
		// Skip if already converted to HTML
		if (match.includes('<a href=')) {
			return match
		}

		// Generate appropriate URL based on content type and available sources
		const mappedUrl = mapContentTypeToUrl(linkText.trim(), '', sources)
		return ` <a href="${mappedUrl}" target="_blank" rel="noopener noreferrer" class="suggested-link-text" style="color: var(--jh-green-04);">${linkText.trim()}</a>`
	})

	return result
}

function convertMarkdownLinks(text: string, sources?: SearchItem[]): string {
	// Match standard markdown links: [Link Text](URL)
	const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

	const result = text.replace(markdownLinkRegex, (match, linkText, url) => {
		// Skip if already converted to HTML
		if (match.includes('<a href=')) {
			return match
		}

		// Generate appropriate URL based on content type and available sources
		const mappedUrl = mapContentTypeToUrl(linkText, url, sources)
		return `<a href="${mappedUrl}" target="_blank" rel="noopener noreferrer" class="markdown-link" style="color: var(--jh-green-04);">${linkText}</a>`
	})

	return result
}

function getCategoryFromUrl(url: string): string | null {
	// Map URL patterns to categories
	const urlCategoryMap = {
		'/protocols': 'Protocols',
		'/threads': 'Threads',
		'/videos': 'Videos',
		'/directory': 'Directories',
		'/profile': 'People',
		'/community/groups': 'Groups',
		'/community/events': 'Events',
		'/community/pages': 'Pages',
		'/discover': 'All',
		'/community': 'Groups',
	}

	return urlCategoryMap[url as keyof typeof urlCategoryMap] || null
}

function constructCategoryUrl(href: string, category: string): string {
	// Remove leading slash if present
	const cleanHref = href.startsWith('/') ? href.slice(1) : href

	// Map categories to URL prefixes
	const categoryPrefixes = {
		Protocols: '/protocol',
		Threads: '/thread',
		Videos: '/video',
		Directories: '/directory',
		People: '/listing',
		Groups: '/community/group',
		Events: '/community/event',
		Pages: '/community/page',
		All: '/directory',
	}

	const prefix = categoryPrefixes[category as keyof typeof categoryPrefixes] || '/directory'
	return `${prefix}/${cleanHref}`
}

function mapContentTypeToUrl(
	linkText: string,
	originalUrl: string,
	sources?: SearchItem[]
): string {
	const text = linkText.toLowerCase()

	// First, try to find a matching source based on the link text
	if (sources && sources.length > 0) {
		const bestMatch = findBestSourceMatch(linkText, sources)
		if (bestMatch && bestMatch.href && bestMatch.href !== '#') {
			// Construct proper URL with category prefix
			return constructCategoryUrl(bestMatch.href, bestMatch.category)
		}
	}

	// If no matching source found, try to find sources by category
	if (sources && sources.length > 0) {
		const categoryMappings = {
			protocol: 'Protocols',
			protocols: 'Protocols',
			thread: 'Threads',
			threads: 'Threads',
			discover: 'All',
			discovery: 'All',
			community: 'Groups',
			video: 'Videos',
			videos: 'Videos',
			directory: 'Directories',
			profile: 'People',
			group: 'Groups',
			groups: 'Groups',
			event: 'Events',
			events: 'Events',
			page: 'Pages',
			pages: 'Pages',
			health: 'Protocols',
			wellness: 'Protocols',
			treatment: 'Protocols',
			therapy: 'Protocols',
			nutrition: 'Protocols',
			detox: 'Protocols',
			holistic: 'Protocols',
			natural: 'Protocols',
			alternative: 'Protocols',
			functional: 'Protocols',
			integrative: 'Protocols',
		}

		// Find sources that match the category
		for (const [keyword, category] of Object.entries(categoryMappings)) {
			if (text.includes(keyword)) {
				const categoryMatch = sources.find(source => source.category === category)
				if (categoryMatch && categoryMatch.href && categoryMatch.href !== '#') {
					return constructCategoryUrl(categoryMatch.href, categoryMatch.category)
				}
			}
		}

		// If still no match, try to find any source that might be relevant
		// This helps when the AI generates generic links like [Discover Protocols](/protocols)
		if (originalUrl && originalUrl !== '#') {
			// Try to find a source that matches the original URL pattern
			const urlCategory = getCategoryFromUrl(originalUrl)
			if (urlCategory) {
				const urlMatch = sources.find(source => source.category === urlCategory)
				if (urlMatch && urlMatch.href && urlMatch.href !== '#') {
					return constructCategoryUrl(urlMatch.href, urlMatch.category)
				}
			}
		}
	}

	// Fallback to static URL mapping if no sources available or no matches found
	const urlMappings = {
		protocol: '/protocols',
		protocols: '/protocols',
		thread: '/threads',
		threads: '/threads',
		discover: '/discover',
		discovery: '/discover',
		community: '/community',
		video: '/videos',
		videos: '/videos',
		directory: '/directory',
		profile: '/profile',
		group: '/community/groups',
		groups: '/community/groups',
		event: '/community/events',
		events: '/community/events',
		page: '/community/pages',
		pages: '/community/pages',
		health: '/protocols',
		wellness: '/protocols',
		treatment: '/protocols',
		therapy: '/protocols',
		nutrition: '/protocols',
		detox: '/protocols',
		holistic: '/protocols',
		natural: '/protocols',
		alternative: '/protocols',
		functional: '/protocols',
		integrative: '/protocols',
	}

	// Check if the link text contains any of the mapped keywords
	for (const [keyword, url] of Object.entries(urlMappings)) {
		if (text.includes(keyword)) {
			return url
		}
	}

	// If no specific mapping found, return the original URL or default to protocols
	return originalUrl || '/protocols'
}

function convertBoldTextToLinks(text: string, sources?: SearchItem[]): string {
	if (!sources || sources.length === 0) {
		return text
	}

	// Find all bold text patterns like <strong>text</strong>
	const boldTextRegex = /<strong>(.*?)<\/strong>/g

	return text.replace(boldTextRegex, (match, boldText) => {
		// Find the best matching source based on title similarity
		const bestMatch = findBestSourceMatch(boldText, sources)

		if (bestMatch) {
			const href = bestMatch.href || bestMatch.url || '#'
			return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-link">${boldText}</a>`
		}

		// If no match found, return the original bold text
		return match
	})
}

function findBestSourceMatch(boldText: string, sources: SearchItem[]): SearchItem | null {
	if (!sources || sources.length === 0) return null

	const normalizedBoldText = boldText.toLowerCase().trim()

	// First, try exact title match
	let bestMatch = sources.find(source => source.title.toLowerCase().trim() === normalizedBoldText)

	if (bestMatch) return bestMatch

	// Then, try partial title match
	bestMatch = sources.find(
		source =>
			source.title.toLowerCase().includes(normalizedBoldText) ||
			normalizedBoldText.includes(source.title.toLowerCase())
	)

	if (bestMatch) return bestMatch

	// Try matching with description
	bestMatch = sources.find(source => source.description?.toLowerCase().includes(normalizedBoldText))

	if (bestMatch) return bestMatch

	// Try matching with content
	bestMatch = sources.find(source => source.content?.toLowerCase().includes(normalizedBoldText))

	if (bestMatch) return bestMatch

	// Return the first source as fallback
	return sources[0]
}

function convertKeyPhrasesToLinks(text: string, sources?: SearchItem[]): string {
	if (!sources || sources.length === 0) {
		return text
	}

	// Define key phrases that should be linked (sorted by length, longest first)
	const keyPhrases = [
		'implementation and monitoring',
		'evidence-based information',
		'healthcare professionals',
		'patient care guidelines',
		'treatment effectiveness',
		'clinical protocols',
		'healthcare standards',
		'continuous evaluation',
		'protocol development',
		'identify the purpose',
		'research and evidence',
		'outline the protocol',
		'review and approval',
		'define your goals',
		'choose the right format',
		'consider existing protocols',
		'patient population',
		'treatment modality',
		'contraindications',
		'evidence-based',
		'best practices',
		'patient care',
		'health condition',
		'protocols',
		'naturopathy',
		'treatment',
		'treatments',
		'consultation',
		'implementation',
		'monitoring',
		'stakeholders',
		'guidelines',
		'precautions',
		'outcomes',
		'effectiveness',
		'refinement',
		'evaluation',
		'protocol',
		'naturopathic',
	]

	let result = text

	// Process phrases from longest to shortest to avoid conflicts
	keyPhrases.forEach(phrase => {
		// Escape special regex characters in the phrase
		const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const regex = new RegExp(`\\b(${escapedPhrase})\\b`, 'gi')

		result = result.replace(regex, match => {
			// Skip if already inside a link tag
			if (isInsideLink(result, match)) {
				return match
			}

			const bestMatch = findBestSourceMatch(match, sources)

			if (bestMatch) {
				const href = bestMatch.href || bestMatch.url || '#'
				return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-link">${match}</a>`
			}

			return match
		})
	})

	return result
}

function isInsideLink(text: string, match: string): boolean {
	const matchIndex = text.indexOf(match)
	if (matchIndex === -1) return false

	// Find the last <a> tag before this match
	const beforeMatch = text.substring(0, matchIndex)
	const lastOpenTag = beforeMatch.lastIndexOf('<a ')
	const lastCloseTag = beforeMatch.lastIndexOf('</a>')

	// If there's an open tag after the last close tag, we're inside a link
	return lastOpenTag > lastCloseTag
}
