import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ImageData } from '@/schema/createProtocol.schema'

export type ImageStore = {
	images: Map<string, ImageData>
	addImage: (image: ImageData) => void
	removeImage: (id: string) => void
	getImage: (id: string) => ImageData | undefined
	getAllImages: () => ImageData[]
	clearImages: () => void
	// Helper to extract images from HTML content
	extractImagesFromHTML: (html: string) => ImageData[]
	// Helper to replace base64 with image references in HTML
	replaceImagesInHTML: (html: string, images: ImageData[]) => string
}

// Custom storage for Map serialization
const createMapStorage = () => ({
	getItem: (name: string) => {
		const str = localStorage.getItem(name)
		if (!str) return null
		const parsed = JSON.parse(str)
		return {
			state: {
				...parsed.state,
				images: new Map(parsed.state.images || []),
			},
		}
	},
	setItem: (name: string, value: { state: ImageStore }) => {
		const serialized = {
			state: {
				...value.state,
				images: Array.from(value.state.images.entries()),
			},
		}
		localStorage.setItem(name, JSON.stringify(serialized))
	},
	removeItem: (name: string) => localStorage.removeItem(name),
})

export const useImageStore = create<ImageStore>()(
	persist(
		(set, get) => ({
			images: new Map(),

			addImage: (image: ImageData) => {
				set(state => {
					const newImages = new Map(state.images)
					newImages.set(image.id, image)
					return { images: newImages }
				})
			},

			removeImage: (id: string) => {
				set(state => {
					const newImages = new Map(state.images)
					newImages.delete(id)
					return { images: newImages }
				})
			},

			getImage: (id: string) => {
				return get().images.get(id)
			},

			getAllImages: () => {
				return Array.from(get().images.values())
			},

			clearImages: () => {
				set({ images: new Map() })
			},

			extractImagesFromHTML: (html: string) => {
				const images: ImageData[] = []
				const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi
				let match

				while ((match = imgRegex.exec(html)) !== null) {
					const src = match[1]
					if (src.startsWith('data:image/')) {
						// This is a base64 image, we need to find it in our store
						const allImages = get().getAllImages()
						const foundImage = allImages.find(img => img.src === src)
						if (foundImage) {
							images.push(foundImage)
						}
					}
				}

				return images
			},

			replaceImagesInHTML: (html: string, images: ImageData[]) => {
				let updatedHTML = html

				images.forEach(image => {
					// Replace base64 data URLs with image references
					const base64Regex = new RegExp(image.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
					updatedHTML = updatedHTML.replace(base64Regex, `/api/images/${image.id}`)
				})

				return updatedHTML
			},
		}),
		{
			name: 'image-store',
			storage: createMapStorage(),
		}
	)
)
