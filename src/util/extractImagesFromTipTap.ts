import type { JSONContent } from '@tiptap/react'
import type { ImageData } from '@/store/CreateProtocolStore'

/**
 * Extract images from HTML string
 * Uses a single regex to capture all attributes efficiently
 */
const extractImagesFromHTML = (html: string): ImageData[] => {
	const images: ImageData[] = []
	const seenSrcs = new Set<string>()

	// More robust regex that handles both single and double quotes
	const imgRegex = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*(?:\salt=["']([^"']*)["'])?[^>]*>/gi
	let match

	while ((match = imgRegex.exec(html)) !== null) {
		const src = match[1]
		// Skip duplicates
		if (seenSrcs.has(src)) continue
		seenSrcs.add(src)

		images.push({
			src,
			alt: match[2] || undefined,
		})
	}

	return images
}

/**
 * Extract all images from TipTap JSON content
 * Handles both proper TipTap image nodes and HTML strings within text nodes
 */
export const extractImagesFromTipTap = (content: JSONContent[]): ImageData[] => {
	if (!content || !Array.isArray(content)) return []

	const images: ImageData[] = []
	const seenSrcs = new Set<string>()

	const walkNodes = (nodes: JSONContent[]) => {
		if (!Array.isArray(nodes)) return

		nodes.forEach(node => {
			if (!node || typeof node !== 'object') return

			// Check if node is a proper TipTap image node
			if (node.type === 'image' && typeof node.attrs?.src === 'string') {
				const src = node.attrs.src
				if (!seenSrcs.has(src)) {
					seenSrcs.add(src)
					images.push({
						src,
						alt: typeof node.attrs.alt === 'string' ? node.attrs.alt : undefined,
						title: typeof node.attrs.title === 'string' ? node.attrs.title : undefined,
					})
				}
			}

			// Check if node is a text node containing HTML with images
			if (node.type === 'text' && typeof node.text === 'string' && node.text.includes('<img')) {
				const htmlImages = extractImagesFromHTML(node.text)
				htmlImages.forEach(img => {
					if (!seenSrcs.has(img.src)) {
						seenSrcs.add(img.src)
						images.push(img)
					}
				})
			}

			// Recursively check child nodes
			if (node.content && Array.isArray(node.content)) {
				walkNodes(node.content)
			}
		})
	}

	try {
		walkNodes(content)
	} catch (error) {
		console.error('Error extracting images from TipTap content:', error)
	}

	return images
}

/**
 * Extract images from multiple TipTap JSON fields
 * Automatically deduplicates images across all fields
 */
export const extractAllImages = (fields: Record<string, JSONContent[]>): ImageData[] => {
	if (!fields || typeof fields !== 'object') return []

	const seenSrcs = new Set<string>()
	const uniqueImages: ImageData[] = []

	Object.values(fields).forEach(content => {
		if (!Array.isArray(content)) return

		const fieldImages = extractImagesFromTipTap(content)
		fieldImages.forEach(img => {
			if (!seenSrcs.has(img.src)) {
				seenSrcs.add(img.src)
				uniqueImages.push(img)
			}
		})
	})

	return uniqueImages
}
