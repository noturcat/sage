export interface ParsedReviveTag {
	zoneId: number
	adId: string
	baseUrl: string
	imageUrl: string
	clickUrl: string
	title: string
	description: string
	bannerId: string
	campaignId: string
	signature: string
	destination: string
	destinationDomain: string
	destinationPath: string
}

export async function fetchAdContent(zoneId: number): Promise<string> {
	const baseUrl = 'https://dev-api.justholistics.com/adserver/www/delivery/ajs.php'
	const randomNumber = Math.floor(Math.random() * 999999999)
	const currentLocation = encodeURIComponent(window.location.href)
	const referrer = document.referrer ? encodeURIComponent(document.referrer) : ''

	const url = `${baseUrl}?zoneid=${zoneId}&cb=${randomNumber}&charset=UTF-8&loc=${currentLocation}&referer=${referrer}`

	try {
		const response = await fetch(url)
		const content = await response.text()
		return content
	} catch {
		return ''
	}
}

export function extractDestinationDomain(clickUrl: string): string {
	const destMatch = clickUrl.match(/dest=([^&]+)/)
	if (!destMatch) return ''

	const decodedDest = decodeURIComponent(destMatch[1])

	try {
		const url = new URL(decodedDest)
		const pathParts = url.pathname.split('/').filter(part => part.length > 0)
		if (pathParts.length > 0) {
			return `${url.hostname}/${pathParts[0]}`
		}
		return url.hostname
	} catch {
		const domainMatch = decodedDest.match(/https?:\/\/([^\/]+)/)
		return domainMatch ? domainMatch[1] : ''
	}
}

export function extractDestinationUrl(clickUrl: string): string {
	const destMatch = clickUrl.match(/dest=([^&]+)/)
	if (!destMatch) return ''

	const decodedDest = decodeURIComponent(destMatch[1])

	return decodedDest
}

export function extractDestinationPath(clickUrl: string): string {
	const destMatch = clickUrl.match(/dest=([^&]+)/)
	if (!destMatch) return ''

	const decodedDest = decodeURIComponent(destMatch[1])

	try {
		const url = new URL(decodedDest)
		const pathParts = url.pathname.split('/').filter(part => part.length > 0)

		return pathParts.length > 0 ? pathParts[0] : ''
	} catch {
		const pathMatch = decodedDest.match(/https?:\/\/[^\/]+\/([^\/\?]+)/)
		return pathMatch ? pathMatch[1] : ''
	}
}

export function parseAdJavaScript(jsContent: string): ParsedReviveTag {
	const varMatch = jsContent.match(
		/var\s+OX_\w+\s*=\s*['"](.*?)['"];?\s*OX_\w+\s*\+=\s*['"](.*?)['"];?\s*document\.write\(OX_\w+\);?/
	)

	if (!varMatch) {
		return getDefaultParsedData()
	}

	const fullContent = varMatch[1] + varMatch[2]

	const clickUrlMatch = fullContent.match(/href=\\?['"]([^'"]+)['"]/)
	let clickUrl = clickUrlMatch ? clickUrlMatch[1] : ''

	const imageUrlMatch = fullContent.match(/src=\\?['"]([^'"]+)['"]/)
	let imageUrl = imageUrlMatch ? imageUrlMatch[1] : ''

	let title = ''
	let description = ''

	const titlePatterns = [
		/title=\\?['"]([^'"]+)['"]/, // title="..."
		/title=\\?([^\\s>]+)/, // title=value
		/title=\\?['"]([^'"]*?)['"]/, // title="..." with non-greedy match
	]

	for (const pattern of titlePatterns) {
		const titleMatch = fullContent.match(pattern)
		if (titleMatch && titleMatch[1] && titleMatch[1].trim() !== '') {
			title = titleMatch[1].replace(/\\/g, '')
			break
		}
	}

	// Extract description from the text content between anchor tags
	const descriptionMatch = fullContent.match(/>([^<]+)</)
	if (descriptionMatch && descriptionMatch[1]) {
		description = descriptionMatch[1]
			.replace(/\\/g, '')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			.replace(/&#x2F;/g, '/')
			.replace(/&nbsp;/g, ' ')
			.replace(/&#39;/g, "'")
			.trim()
	}

	if (!title) {
		const targetPatterns = [
			/target=\\?['"]([^'"]+)['"]/, // target="..."
			/target=\\?([^\\s>]+)/, // target=value
		]

		for (const pattern of targetPatterns) {
			const targetMatch = fullContent.match(pattern)
			if (targetMatch && targetMatch[1] && targetMatch[1].trim() !== '') {
				title = targetMatch[1].replace(/\\/g, '')
				break
			}
		}
	}

	if (!title) {
		const altMatch = fullContent.match(/alt=\\?['"]([^'"]+)['"]/)
		if (altMatch && altMatch[1] && altMatch[1].trim() !== '') {
			title = altMatch[1].replace(/\\/g, '')
		}
	}

	const bannerIdMatch = clickUrl.match(/bannerid=(\d+)/)
	const bannerId = bannerIdMatch ? bannerIdMatch[1] : ''

	const campaignIdMatch = fullContent.match(/campaignid=(\d+)/)
	const campaignId = campaignIdMatch ? campaignIdMatch[1] : ''

	const sigMatch = clickUrl.match(/sig=([^&]+)/)
	const signature = sigMatch ? sigMatch[1] : ''

	const destination = extractDestinationUrl(clickUrl)

	const zoneIdMatch = clickUrl.match(/zoneid=(\d+)/)
	const zoneId = zoneIdMatch ? parseInt(zoneIdMatch[1]) : 7

	const decodeHtmlEntities = (text: string): string => {
		return text
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			.replace(/&#x2F;/g, '/')
			.replace(/&nbsp;/g, ' ')
			.replace(/&#39;/g, "'")
	}

	clickUrl = decodeHtmlEntities(clickUrl)
	imageUrl = decodeHtmlEntities(imageUrl)

	const destinationDomain = extractDestinationDomain(clickUrl)
	const destinationPath = extractDestinationPath(clickUrl)

	return {
		zoneId,
		adId: bannerId,
		baseUrl: 'https://dev-api.justholistics.com',
		imageUrl,
		clickUrl,
		title,
		description,
		bannerId,
		campaignId,
		signature,
		destination,
		destinationDomain,
		destinationPath,
	}
}

function getDefaultParsedData(): ParsedReviveTag {
	return {
		zoneId: 7,
		adId: '',
		baseUrl: 'https://dev-api.justholistics.com',
		imageUrl: '',
		clickUrl: '',
		title: '',
		description: '',
		bannerId: '',
		campaignId: '',
		signature: '',
		destination: '',
		destinationDomain: '',
		destinationPath: '',
	}
}

export function debugTitleExtraction(content: string): void {
	const titlePatterns = [
		{ name: 'title="..."', pattern: /title=\\?['"]([^'"]+)['"]/ },
		{ name: 'title=value', pattern: /title=\\?([^\\s>]+)/ },
		{ name: "title='...'", pattern: /title='([^']+)'/ },
		{ name: 'title="..." (noscript)', pattern: /title="([^"]+)"/ },
		{ name: 'target="..."', pattern: /target=\\?['"]([^'"]+)['"]/ },
		{ name: 'target=value', pattern: /target=\\?([^\\s>]+)/ },
		{ name: "target='...'", pattern: /target='([^']+)'/ },
		{ name: 'alt="..."', pattern: /alt=\\?['"]([^'"]+)['"]/ },
		{ name: "alt='...'", pattern: /alt='([^']+)'/ },
	]

	titlePatterns.forEach(({ name, pattern }) => {
		const match = content.match(pattern)
		console.log(`${name}:`, match ? match[1] : 'No match')
	})
}

export function testSpecificAdContent(): void {
	const testContent = `;`

	debugTitleExtraction(testContent)
}

export function parseReviveTag(rawTag: string): ParsedReviveTag {
	const zoneIdMatch = rawTag.match(/zoneid=(\d+)/)
	const zoneId = zoneIdMatch ? parseInt(zoneIdMatch[1]) : 6

	const adIdMatch = rawTag.match(/n=([a-f0-9]+)/)
	const adId = adIdMatch ? adIdMatch[1] : 'a5f56b87'

	const baseUrlMatch = rawTag.match(/https?:\/\/[^\/]+/)
	const baseUrl = baseUrlMatch ? baseUrlMatch[0] : 'https://dev-api.justholistics.com'

	const noscriptMatch = rawTag.match(/<noscript>[\s\S]*?<\/noscript>/)
	const noscript = noscriptMatch ? noscriptMatch[0] : ''

	const decodeHtmlEntities = (text: string): string => {
		return text
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			.replace(/&#x2F;/g, '/')
			.replace(/&nbsp;/g, ' ')
			.replace(/&#39;/g, "'")
	}

	const replacePlaceholder = (url: string): string => {
		if (url.includes('INSERT_RANDOM_NUMBER_HERE')) {
			const randomNumber = Math.floor(Math.random() * 99999999999)
			return url.replace('INSERT_RANDOM_NUMBER_HERE', randomNumber.toString())
		}
		return url
	}

	const imageUrlMatch = noscript.match(/src='([^']+)'/)
	let imageUrl = imageUrlMatch ? imageUrlMatch[1] : ''
	imageUrl = decodeHtmlEntities(imageUrl)
	imageUrl = replacePlaceholder(imageUrl)

	const clickUrlMatch = noscript.match(/href='([^']+)'/)
	let clickUrl = clickUrlMatch ? clickUrlMatch[1] : ''
	clickUrl = decodeHtmlEntities(clickUrl)
	clickUrl = replacePlaceholder(clickUrl)

	let title = ''
	const titlePatterns = [
		/title='([^']+)'/, // title='...'
		/title="([^"]+)"/, // title="..."
		/title=([^\\s>]+)/, // title=value
	]

	for (const pattern of titlePatterns) {
		const titleMatch = noscript.match(pattern)
		if (titleMatch && titleMatch[1]) {
			title = titleMatch[1]
			break
		}
	}

	if (!title) {
		const altPatterns = [
			/alt='([^']+)'/, // alt='...'
			/alt="([^"]+)"/, // alt="..."
		]

		for (const pattern of altPatterns) {
			const altMatch = noscript.match(pattern)
			if (altMatch && altMatch[1]) {
				title = altMatch[1]
				break
			}
		}
	}

	title = decodeHtmlEntities(title)

	let description = ''
	const descriptionMatch = noscript.match(/>([^<]+)</)
	if (descriptionMatch && descriptionMatch[1]) {
		description = decodeHtmlEntities(descriptionMatch[1]).trim()
	}

	const destination = extractDestinationUrl(clickUrl)
	const destinationDomain = extractDestinationDomain(clickUrl)
	const destinationPath = extractDestinationPath(clickUrl)

	return {
		zoneId,
		adId,
		baseUrl,
		imageUrl,
		clickUrl,
		title,
		description,
		bannerId: adId,
		campaignId: '',
		signature: '',
		destination,
		destinationDomain,
		destinationPath,
	}
}
