'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import FileCardInput from '@/components/molecules/cards/file-card-input/FileCardInput'
import { useCreateProtocolStore } from '@/store/CreateProtocolStore'
import { useCreateProtocol } from '@/app/api/protocols/mutations/create-protocol'
import { JSONContent } from '@tiptap/react'
import { extractAllImages } from '@/util/extractImagesFromTipTap'
import { StatusEnum } from '@/types/Enums'
import { CreateProtocolType } from '@/types/Protocol.type'
import { FeaturedMediaForm, featuredMediaSchema } from '@/schema/featuredMedia.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useUserStore from '@/store/UserStore'

import style from './PublishProtocolPage.module.scss'

/**
 * **Final review and submission page** for protocol publishing.
 *
 * A streamlined page that provides the final step in the protocol creation workflow,
 * allowing users to review their protocol content, select a social preview image,
 * and submit it for publication.
 *
 * Example:
 * ```tsx
 * <PublishProtocolPage />
 * ```
 *
 * Notes:
 * - Final protocol review and submission interface.
 * - Social preview card with image selection.
 * - Extracts images from rich text content automatically.
 * - Navigation controls with back and submit buttons.
 * - Integration with protocol creation workflow.
 * - Handles API submission with loading states.
 */

function PublishProtocolPage() {
	const router = useRouter()
	const { formData, images, selectedPreviewImage, setImages, reset, _hasHydrated } =
		useCreateProtocolStore()
	const { user } = useUserStore()
	const form = useForm<FeaturedMediaForm>({
		resolver: zodResolver(featuredMediaSchema),
		defaultValues: {
			featured_media: selectedPreviewImage || undefined,
		},
	})

	useEffect(() => {
		if (selectedPreviewImage) {
			form.setValue('featured_media', selectedPreviewImage)
		}
	}, [selectedPreviewImage, form])

	useEffect(() => {
		if (_hasHydrated && !formData) {
			router.push('/protocols/create-protocol')
		}
	}, [_hasHydrated, formData, router])

	useEffect(() => {
		if (formData && images.length === 0) {
			const extractContent = (field: JSONContent[]): JSONContent[] => {
				if (typeof field === 'string') {
					return [{ type: 'paragraph', content: [{ type: 'text', text: field }] }]
				}
				return field || []
			}

			const allImages = extractAllImages({
				ingredients: extractContent(formData.ingredients || []),
				mechanism: extractContent(formData.mechanism || []),
				timeline: extractContent(formData.timeline || []),
				instructions: extractContent(formData.instructions || []),
				disclaimer: formData.disclaimer ? extractContent(formData.disclaimer || []) : [],
			})

			setImages(allImages)
		}
	}, [formData, images.length, setImages])

	useEffect(() => {
		return () => {
			setTimeout(() => {
				const stillInFlow = window.location.pathname.startsWith('/protocols/create-protocol')
				if (!stillInFlow) {
					reset()
				}
			}, 0)
		}
	}, [reset])

	const { mutateAsync: createProtocol, isPending } = useCreateProtocol()

	const handleSubmit = async (data: FeaturedMediaForm) => {
		if (!formData || isPending) return

		const extractContent = (field: JSONContent[]): JSONContent[] => {
			if (typeof field === 'string') {
				return [{ type: 'paragraph', content: [{ type: 'text', text: field }] }]
			}
			return field || []
		}

		const dataToSubmit = {
			category_id: Number(formData.category),
			title: formData.title,
			summary: 'summary',
			ingredients: extractContent(formData.ingredients || []),
			mechanism: extractContent(formData.mechanism || []),
			timeline: extractContent(formData.timeline || []),
			instructions: extractContent(formData.instructions || []),
			disclaimer: formData.disclaimer ? extractContent(formData.disclaimer || []) : [],
			sources: formData.sources || [],
			faqs: formData.faqs || [],
			tags: formData.tags?.map(tag => tag.value) || [],
			author_id: user?.id ?? 0,
			status: StatusEnum.PUBLISHED,
			featured_media: data.featured_media as File,
		}

		try {
			const response = await createProtocol(dataToSubmit as CreateProtocolType)

			const slug = response?.data?.attributes?.slug
			const id = response?.data?.id

			if (!slug || !id) {
				router.replace('/protocols')
				return
			}

			router.replace(`/protocols/${slug}?id=${id}`)
		} catch (error) {
			console.error('Failed to create protocol:', error)
			router.replace('/protocols/create-protocol')
		}
	}

	if (!_hasHydrated || !formData) {
		return null
	}

	return (
		<main className={style.wrapper}>
			<section className={style.container}>
				<div className={style.buttonsContainer}>
					<CustomButton
						size="icon"
						className={style.backButton}
						radius="full"
						onClick={() => router.back()}
					>
						<span className={style.iconBack} />
					</CustomButton>
					<p className={style.publish}>Publish</p>
					<CustomButton
						className={style.continueButton}
						radius="full"
						onClick={form.handleSubmit(handleSubmit)}
						disabled={isPending}
					>
						{isPending ? (
							<div className={style.publishing}>
								<span>Publishing</span>
								<span className={style.spinner} />
							</div>
						) : (
							'Submit'
						)}
					</CustomButton>
				</div>

				<div className={style.content}>
					<FileCardInput
						label="SOCIAL PREVIEW"
						title="Protocol File"
						description={formData.title}
						required
						extractedImages={images}
						selectedImage={form.getValues('featured_media')}
						onImageSelect={image => {
							if (image !== null) {
								form.setValue('featured_media', image)
							}
						}}
					/>
					{form.formState.errors.featured_media && (
						<p className={style.errorMessage}>
							{form.formState.errors.featured_media.message as string}
						</p>
					)}
				</div>
			</section>
		</main>
	)
}

export default PublishProtocolPage
