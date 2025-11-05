'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCreateProtocolStore } from '@/store/CreateProtocolStore'
import CustomButton from '@/components/atoms/button/CustomButton'
import { ProtocolInfoCardInput } from '@/components/molecules/cards/protocol-card/ProtocolInfoCard'
import { FAQsCardInput } from '@/components/molecules/cards/protocol-card/FAQsCard'
import { SourceCardInput } from '@/components/molecules/cards/protocol-card/SourceCard'
import { Input } from '@/components/atoms/input/Input'
import { PillInputForm } from '@/components/atoms/pill/PillInput'
import { tags } from '@/components/pages/protocols/tags'
import { useForm, useFieldArray, Path } from 'react-hook-form'
import { CreateProtocolForm, createProtocolSchema } from '@/schema/createProtocol.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/atoms/form/Form'
import { SelectInput } from '@/components/atoms/form/select/Select'
import { placeholder } from '@/components/pages/protocols/placeholder'
import { extractAllImages } from '@/util/extractImagesFromTipTap'
import { JSONContent } from '@tiptap/react'
import { useGetCategories } from '@/app/api/categories/queries/categories'

import style from './CreateProtocolPage.module.scss'

/**
 * **Comprehensive form page** for creating new protocols.
 *
 * Feature-rich form page that allows users to create detailed protocols with structured
 * information including category selection, tags, ingredients, mechanism, timeline, instructions,
 * FAQs, and sources. Features dynamic form fields, validation, and state management.
 *
 * Example:
 * ```tsx
 * <CreateProtocolPage />
 * ```
 *
 * Notes:
 * - Multi-step form with comprehensive protocol information fields.
 * - Category selection with predefined options.
 * - Dynamic tag selection with pill input component.
 * - Rich text input for ingredients, mechanism, timeline, and instructions.
 * - Dynamic FAQ management (add/remove, max 10 FAQs).
 * - Dynamic source management (add/remove, max 20 sources).
 * - Form validation using Zod schema with React Hook Form.
 * - State management integration with CreateProtocolStore.
 */

function CreateProtocolPage() {
	const router = useRouter()
	const pathname = usePathname()
	const hasHydratedRef = useRef(false)
	const [titleFocused, setTitleFocused] = useState(false)
	const { formData, setFormData, images, setImages, reset, _hasHydrated } = useCreateProtocolStore()
	const titleInputRef = useRef<HTMLInputElement>(null)
	const { data: categoriesData } = useGetCategories()

	useEffect(() => {
		return () => {
			setTimeout(() => {
				const stillInFlow = window.location.pathname.startsWith('/protocols/create-protocol')
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
				ingredients: extractContent(formData.ingredients || []),
				mechanism: extractContent(formData.mechanism || []),
				timeline: extractContent(formData.timeline || []),
				instructions: extractContent(formData.instructions || []),
				disclaimer: extractContent(formData.disclaimer || []),
			}

			const allImages = extractAllImages(fieldsToExtract)
			setImages(allImages)
		}
	}, [formData, images.length, setImages])

	const form = useForm<CreateProtocolForm>({
		resolver: zodResolver(createProtocolSchema),
		defaultValues: {
			category: '',
			title: '',
			tags: [],
			ingredients: [],
			mechanism: [],
			timeline: [],
			instructions: [],
			disclaimer: [],
			faqs: [{ question: '', answer: '' }],
			sources: [{ link: '' }],
			featured_media: null,
		},
	})

	useEffect(() => {
		if (formData && _hasHydrated && !hasHydratedRef.current) {
			hasHydratedRef.current = true
			form.reset({
				category: formData.category || '',
				title: formData.title || '',
				tags: formData.tags || [],
				ingredients: formData.ingredients || [],
				mechanism: formData.mechanism || [],
				timeline: formData.timeline || [],
				instructions: formData.instructions || [],
				disclaimer: formData.disclaimer || [],
				faqs: formData.faqs || [{ question: '', answer: '' }],
				sources: formData.sources || [{ link: '' }],
				featured_media: formData.featured_media || null,
			})
		}
	}, [form, formData, _hasHydrated])

	const {
		fields: sourceFields,
		append: appendSource,
		remove: removeSource,
	} = useFieldArray({
		control: form.control,
		name: 'sources',
	})

	const {
		fields: faqFields,
		append: appendFaq,
		remove: removeFaq,
	} = useFieldArray({
		control: form.control,
		name: 'faqs',
	})

	const categoriesOptions = categoriesData?.data?.map(category => ({
		value: category.id.toString(),
		label: category.attributes.name,
	}))

	const onSubmit = (data: CreateProtocolForm) => {
		const extractContent = (field: JSONContent[]): JSONContent[] => {
			return field || []
		}

		const allImages = extractAllImages({
			ingredients: extractContent(data.ingredients),
			mechanism: extractContent(data.mechanism),
			timeline: extractContent(data.timeline),
			instructions: extractContent(data.instructions),
			disclaimer: data.disclaimer ? extractContent(data.disclaimer) : [],
		})

		setFormData(data)
		setImages(allImages)

		router.push('/protocols/create-protocol/publish')
	}

	const handleBack = () => {
		router.back()
	}

	const handleAddSource = () => {
		if (sourceFields.length < 20) {
			appendSource({ link: '' })
		}
	}

	const handleRemoveSource = (index: number) => {
		if (sourceFields.length > 1) {
			removeSource(index)
		}
	}

	const handleAddFaq = () => {
		if (faqFields.length < 10) {
			appendFaq({ question: '', answer: '' })
		}
	}

	const handleRemoveFaq = (index: number) => {
		if (faqFields.length > 1) {
			removeFaq(index)
		}
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
							variant="outline"
							radius="full"
							onClick={form.handleSubmit(onSubmit)}
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
						<div className={style.protocolInfo}>
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
															field.ref(el)
															titleInputRef.current = el
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

							<ProtocolInfoCardInput
								label="INGREDIENTS / TOOLS"
								fieldName="ingredients"
								placeholder={placeholder.INGREDIENTS}
								form={form}
								required
							/>
							<ProtocolInfoCardInput
								label="MECHANISM"
								fieldName="mechanism"
								placeholder={placeholder.MECHANISM}
								form={form}
								required
							/>
							<ProtocolInfoCardInput
								label="TIMELINE / DURATION"
								fieldName="timeline"
								placeholder={placeholder.TIMELINE}
								form={form}
								required
							/>
							<ProtocolInfoCardInput
								label="HOW TO FOLLOW (INSTRUCTION)"
								fieldName="instructions"
								placeholder={placeholder.INSTRUCTIONS}
								form={form}
								required
							/>
							<div className={style.faqsContainer}>
								<p className={style.faqsLabel}>
									FAQs <span className={style.required}>*</span>
								</p>
								<div className={style.faqsGrid}>
									{faqFields.map((field, index) => (
										<div key={field.id} className={style.faqItem}>
											<FAQsCardInput
												questionFieldName={`faqs.${index}.question` as Path<CreateProtocolForm>}
												answerFieldName={`faqs.${index}.answer` as Path<CreateProtocolForm>}
												faqNumber={index + 1}
												form={form}
											/>
											{faqFields.length > 1 && (
												<CustomButton
													type="button"
													variant="text"
													size="icon"
													radius="full"
													onClick={() => handleRemoveFaq(index)}
													aria-label={`Remove FAQ ${index + 1}`}
												>
													<span className={style.iconRemove} />
												</CustomButton>
											)}
										</div>
									))}
								</div>

								{faqFields.length < 10 && (
									<CustomButton
										type="button"
										variant="outline"
										radius="full"
										onClick={handleAddFaq}
									>
										<span className={style.iconPlus} />
										Add FAQ
									</CustomButton>
								)}
							</div>
							<ProtocolInfoCardInput
								label="OPTIONAL NOTES / DISCLAIMER"
								fieldName="disclaimer"
								placeholder={placeholder.DISCLAIMER}
								form={form}
								required
							/>

							{/* Modified Sources Section */}
							<div className={style.sourcesContainer}>
								<p className={style.sourcesLabel}>
									SOURCES <span className={style.required}>*</span>
								</p>
								<div className={style.sourcesGrid}>
									{sourceFields.map((field, index) => (
										<div key={field.id} className={style.sourceItem}>
											<div className={style.input}>
												<SourceCardInput
													count={index + 1}
													sourceFieldName={`sources.${index}.link` as Path<CreateProtocolForm>}
													form={form}
													placeholder="Enter source URL..."
												/>
											</div>
											{sourceFields.length > 1 && (
												<CustomButton
													type="button"
													variant="text"
													size="icon"
													radius="full"
													onClick={() => handleRemoveSource(index)}
													aria-label={`Remove source ${index + 1}`}
												>
													<span className={style.iconRemove} />
												</CustomButton>
											)}
										</div>
									))}
								</div>

								{sourceFields.length < 20 && (
									<CustomButton
										type="button"
										variant="outline"
										radius="full"
										onClick={handleAddSource}
									>
										<span className={style.iconPlus} />
										Add Source
									</CustomButton>
								)}
							</div>
						</div>
					</form>
				</Form>
			</section>
		</main>
	)
}

export default CreateProtocolPage
