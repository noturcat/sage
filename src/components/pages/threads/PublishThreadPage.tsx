'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import FileCardInput from '@/components/molecules/cards/file-card-input/FileCardInput'
import { useCreateThreadStore } from '@/store/CreateThreadStore'
import { useCreateThread } from '@/app/api/threads/mutations/create-thread'
import { extractAllImages } from '@/util/extractImagesFromTipTap'
import { JSONContent } from '@tiptap/react'
import { StatusEnum } from '@/types/Enums'
import { FeaturedMediaForm, featuredMediaSchema } from '@/schema/featuredMedia.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useUserStore from '@/store/UserStore'

import style from './PublishThreadPage.module.scss'

/**
 * **Final review and submission page** for thread publishing.
 *
 * A streamlined page that provides the final step in the protocol creation workflow,
 * allowing users to review their thread content and submit it for publication.
 * Features a social preview card showing how the thread will appear to users.
 *
 * Example:
 * ```tsx
 * <PublishThreadPage />
 * ```
 *
 * Notes:
 * - Final thread review and submission interface.
 * - Social preview card showing thread appearance.
 * - Navigation controls with back and submit buttons.
 * - Clean, focused layout for final review.
 * - Integration with thread creation workflow.
 * - Responsive design for all device sizes.
 */

function PublishThreadPage() {
	const router = useRouter()
	const { formData, images, selectedPreviewImage, setImages, reset } = useCreateThreadStore()
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
		if (!formData) {
			router.push('/threads/create-thread')
		}
	}, [formData, router])

	useEffect(() => {
		if (formData && images.length === 0) {
			const extractContent = (field: JSONContent[]): JSONContent[] => {
				return field || []
			}

			const allImages = extractAllImages({
				content: extractContent(formData.content),
			})

			setImages(allImages)
		}
	}, [formData, images.length, setImages])

	useEffect(() => {
		return () => {
			setTimeout(() => {
				const stillInFlow = window.location.pathname.startsWith('/threads/create-thread')
				if (!stillInFlow) {
					reset()
				}
			}, 0)
		}
	}, [reset])

	const { mutateAsync: createThread, isPending } = useCreateThread()

	const handleSubmit = async (data: FeaturedMediaForm) => {
		if (!formData || isPending) return

		const extractContent = (field: JSONContent[]): JSONContent[] => {
			return field || []
		}

		const dataToSubmit = {
			category_id: Number(formData.category),
			title: formData.title,
			summary: 'summary',
			average_reading_time: '5 min read',
			content: extractContent(formData.content),
			author_id: user?.id ?? 0,
			status: StatusEnum.PUBLISHED,
			featured_media: data.featured_media as File,
		}

		try {
			const response = await createThread(dataToSubmit)

			const slug = response?.data?.attributes?.slug
			const id = response?.data?.id

			if (!slug || !id) {
				router.replace('/threads')
				return
			}

			router.replace(`/threads/${slug}?id=${id}`)
		} catch (error) {
			console.error('Failed to create thread:', error)
			router.replace('/threads/create-thread')
		}
	}

	if (!formData) {
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
						title="Thread File"
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

export default PublishThreadPage
