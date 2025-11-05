import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CreateProtocolForm } from '@/schema/createProtocol.schema'

export type ImageData = {
	src: string
	alt?: string
	title?: string
}

export type CreateProtocolStore = {
	formData: CreateProtocolForm | null
	setFormData: (data: CreateProtocolForm) => void

	images: ImageData[]
	setImages: (images: ImageData[]) => void

	selectedPreviewImage: File | null
	setSelectedPreviewImage: (file: File | null) => void

	_hasHydrated: boolean
	setHasHydrated: (state: boolean) => void

	reset: () => void
}

export const useCreateProtocolStore = create<CreateProtocolStore>()(
	persist(
		set => ({
			formData: null,
			setFormData: formData => set({ formData }),

			images: [],
			setImages: images => set({ images }),

			selectedPreviewImage: null,
			setSelectedPreviewImage: selectedPreviewImage => set({ selectedPreviewImage }),

			_hasHydrated: false,
			setHasHydrated: state => set({ _hasHydrated: state }),

			reset: () =>
				set({
					formData: null,
					images: [],
					selectedPreviewImage: null,
				}),
		}),
		{
			name: 'create-protocol-store',
			partialize: state => ({
				formData: state.formData,
			}),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true)
			},
		}
	)
)
