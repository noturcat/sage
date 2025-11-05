import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreateDiscoverForm } from '@/schema/createDiscover.schema'

export type ImageData = {
	src: string
	alt?: string
	title?: string
}

export type CreateDiscoverStore = {
	formData: CreateDiscoverForm | null
	images: ImageData[]
	selectedPreviewImage: File | null
	_hasHydrated: boolean
	setHasHydrated: (state: boolean) => void
	setFormData: (formData: CreateDiscoverForm) => void
	setImages: (images: ImageData[]) => void
	setSelectedPreviewImage: (file: File | null) => void
	reset: () => void
}

export const useCreateDiscoverStore = create<CreateDiscoverStore>()(
	persist(
		set => ({
			formData: null,
			images: [],
			selectedPreviewImage: null,
			setFormData: formData => set({ formData }),
			setImages: images => set({ images }),
			setSelectedPreviewImage: selectedPreviewImage => set({ selectedPreviewImage }),
			_hasHydrated: false,
			setHasHydrated: state => set({ _hasHydrated: state }),
			reset: () => set({ formData: null, images: [], selectedPreviewImage: null }),
		}),
		{
			name: 'create-discover-store',
			partialize: state => ({
				formData: state.formData,
			}),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			},
		}
	)
)
