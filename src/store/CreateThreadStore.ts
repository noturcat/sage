import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreateThreadForm } from '@/schema/createThread.schema'

export type ImageData = {
	src: string
	alt?: string
	title?: string
}

export type CreateThreadStore = {
	formData: CreateThreadForm | null
	images: ImageData[]
	selectedPreviewImage: File | null
	_hasHydrated: boolean
	setHasHydrated: (state: boolean) => void
	setFormData: (formData: CreateThreadForm) => void
	setImages: (images: ImageData[]) => void
	setSelectedPreviewImage: (file: File | null) => void
	reset: () => void
}

export const useCreateThreadStore = create<CreateThreadStore>()(
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
			name: 'create-thread-store',
			partialize: state => ({
				formData: state.formData,
			}),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			},
		}
	)
)
