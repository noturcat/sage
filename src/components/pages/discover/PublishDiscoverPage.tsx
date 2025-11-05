'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import FileCardInput from '@/components/molecules/cards/file-card-input/FileCardInput'
import CustomButton from '@/components/atoms/button/CustomButton'
import { useCreateDiscoverStore } from '@/store/CreateDiscoverStore'
import { useCreateDiscover } from '@/app/api/discoveries/mutations/create-discover'
import { extractAllImages } from '@/util/extractImagesFromTipTap'
import { JSONContent } from '@tiptap/react'
import { StatusEnum } from '@/types/Enums'
import { FeaturedMediaForm, featuredMediaSchema } from '@/schema/featuredMedia.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useUserStore from '@/store/UserStore'

import style from './PublishDiscoverPage.module.scss'

function PublishDiscoverPage() {
	const router = useRouter()
	const { formData, images, selectedPreviewImage, setImages, reset } = useCreateDiscoverStore()
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
			router.push('/discover/create-discover')
		}
	}, [formData, router])

	useEffect(() => {
		if (formData && images.length === 0) {
			const extractContent = (field: JSONContent[]): JSONContent[] => {
				return field || []
			}

			const allImages = extractAllImages({
				content: extractContent(formData.content || []),
			})

			setImages(allImages)
		}
	}, [formData, images.length, setImages])

	useEffect(() => {
		return () => {
			setTimeout(() => {
				const stillInFlow = window.location.pathname.startsWith('/discover/create-discover')
				if (!stillInFlow) {
					reset()
				}
			}, 0)
		}
	}, [reset])

	const { mutateAsync: createDiscover, isPending } = useCreateDiscover()

	const handleSubmit = async (data: FeaturedMediaForm) => {
		if (!formData || isPending) return

		const extractContent = (field: JSONContent[]): JSONContent[] => {
			return field || []
		}

		const dataToSubmit = {
			primary_category_id: Number(formData.category),
			title: formData.title,
			summary: 'summary',
			average_reading_time: '5 min read',
			content: extractContent(formData.content),
			author_id: user?.id ?? 0,
			status: StatusEnum.PUBLISHED,
			featured_media: data.featured_media as File,
		}

		try {
			const response = await createDiscover(dataToSubmit)

			const slug = response?.data?.attributes?.slug
			const id = response?.data?.id

			if (!slug || !id) {
				router.replace('/discover')
				return
			}

			router.replace(`/discover/${slug}?id=${id}`)
		} catch (error) {
			console.error('Failed to create discover:', error)
			router.replace('/discover/create-discover')
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
						title="Discover File"
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

export default PublishDiscoverPage
