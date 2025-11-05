'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateThreadStore } from '@/store/CreateThreadStore'
import CustomButton from '@/components/atoms/button/CustomButton'
import { Input } from '@/components/atoms/input/Input'
import { PillInputForm } from '@/components/atoms/pill/PillInput'
import { tags } from '@/components/pages/protocols/tags'
import { createThreadSchema } from '@/schema/createThread.schema'
import type { CreateThreadForm } from '@/schema/createThread.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form/Form'
import { SelectInput } from '@/components/atoms/form/select/Select'
import { ThreadInfoCardInput } from '@/components/molecules/cards/thread-card/ThreadInfoCard'
import { extractAllImages } from '@/util/extractImagesFromTipTap'
import { JSONContent } from '@tiptap/react'
import { useGetCategories } from '@/app/api/categories/queries/categories'

import style from './CreateThreadPage.module.scss'

/**
 * **Comprehensive form page** for creating new threads.
 *
 * Feature-rich form page that allows users to create detailed threads with structured
 * information including category selection, tags, content. Features dynamic form fields, validation, and state management.
 * FAQs, and sources. Features dynamic form fields, validation, and state management.
 *
 * Example:
 * ```tsx
 * <CreateThreadPage />
 * ```
 *
 * Notes:
 * - Multi-step form with comprehensive thread information fields.
 * - Category selection with predefined options.
 * - Dynamic tag selection with pill input component.
 * - Rich text input for content.
 * - Form validation using Zod schema with React Hook Form.
 * - State management integration with CreateThreadStore.
 */

function CreateThreadPage() {
	const router = useRouter()
	const pathname = usePathname()
	const hasHydratedRef = useRef(false)
	const [titleFocused, setTitleFocused] = useState(false)
	const { formData, setFormData, images, setImages, reset, _hasHydrated } = useCreateThreadStore()
	const titleInputRef = useRef<HTMLInputElement>(null)
	const { data: categoriesData } = useGetCategories()

	useEffect(() => {
		return () => {
			setTimeout(() => {
				const stillInFlow = window.location.pathname.startsWith('/threads/create-thread')
				if (!stillInFlow) {
					reset()
					hasHydratedRef.current = false
				}
			}, 0)
		}
	}, [reset])

	useEffect(() => {
		hasHydratedRef.current = false
	}, [pathname])

	useEffect(() => {
		if (formData && images.length === 0) {
			const extractContent = (field: JSONContent[]): JSONContent[] => {
				return field || []
			}

			const fieldsToExtract: Record<string, JSONContent[]> = {
				content: extractContent(formData.content),
			}

			const allImages = extractAllImages(fieldsToExtract)
			setImages(allImages)
		}
	}, [formData, images.length, setImages])

	const form = useForm<CreateThreadForm>({
		resolver: zodResolver(createThreadSchema),
		defaultValues: {
			category: '',
			title: '',
			tags: [],
			content: [],
		},
	})

	useEffect(() => {
		if (formData && _hasHydrated && !hasHydratedRef.current) {
			hasHydratedRef.current = true
			form.reset({
				category: formData.category || '',
				title: formData.title || '',
				tags: formData.tags || [],
				content: formData.content || [],
			})
		}
	}, [form, formData, _hasHydrated])

	const categoriesOptions = categoriesData?.data?.map(category => ({
		value: category.id.toString(),
		label: category.attributes.name,
	}))

	const onSubmit = (data: CreateThreadForm) => {
		// Extract images for social preview
		const extractContent = (field: JSONContent[]): JSONContent[] => {
			return field || []
		}

		const allImages = extractAllImages({
			content: extractContent(data.content),
		})

		setFormData(data)
		setImages(allImages)

		router.push('/threads/create-thread/publish')
	}

	const handleBack = () => {
		router.back()
	}

	return (
		<main className={style.wrapper}>
			<section className={style.container}>
				<div className={style.buttonsContainer}>
					<CustomButton size="icon" className={style.backButton} radius="full" onClick={handleBack}>
						<span className={style.iconBack} />
					</CustomButton>

					<div className={style.continueButtons}>
						<CustomButton
							className={style.previewButton}
							type="button"
							variant="outline"
							radius="full"
						>
							Preview
						</CustomButton>
						<CustomButton
							className={style.continueButton}
							radius="full"
							onClick={form.handleSubmit(onSubmit)}
						>
							Continue
						</CustomButton>
					</div>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className={style.content}>
						<div className={style.threadInfo}>
							<SelectInput
								label="CATEGORY"
								radius="full"
								options={categoriesOptions || []}
								name="category"
								placeholder="Select Category"
								form={form}
								className={style.categorySelect}
								required
							/>

							<div className={style.titleInput}>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => {
										const titleValue = form.watch('title') || ''
										const showLabel = !titleFocused && titleValue === ''

										const handleLabelClick = () => {
											titleInputRef.current?.focus()
										}

										return (
											<FormItem>
												<label
													className={style.titleLabel}
													data-hidden={!showLabel}
													onClick={handleLabelClick}
												>
													TITLE <span className={style.required}>*</span>
												</label>
												<FormControl>
													<Input
														type="text"
														className={style.inputTitle}
														{...field}
														ref={(el: HTMLInputElement) => {
															field.ref(el) // React Hook Form ref
															titleInputRef.current = el // Our ref
														}}
														onFocus={() => {
															setTitleFocused(true)
														}}
														onBlur={() => {
															setTitleFocused(false)
															field.onBlur?.()
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)
									}}
								/>
							</div>
							<PillInputForm
								name="tags"
								label="TAGS"
								form={form}
								options={tags}
								maxSelection={5}
								required
							/>

							<ThreadInfoCardInput
								label="CONTENT"
								fieldName="content"
								placeholder="Start writing..."
								form={form}
								required
							/>
						</div>
					</form>
				</Form>
			</section>
		</main>
	)
}

export default CreateThreadPage
