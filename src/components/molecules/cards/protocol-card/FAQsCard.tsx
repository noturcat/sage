import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/atoms/input/Input'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/atoms/form/Form'
import style from './FAQsCard.module.scss'

/**
 * **Interactive FAQs card** with expandable question/answer sections.
 *
 * Displays FAQ content with native details/summary elements for accessibility.
 * Features smooth transitions and auto-numbered questions with Q prefix.
 *
 * Example:
 * ```tsx
 * <FAQsCard faqs={{ id: 1, question: "How does it work?", answer: "It works by..." }} />
 * ```
 *
 * Notes:
 * - Native keyboard navigation with details/summary elements.
 * - Auto-numbered questions with Q prefix.
 * - Smooth expand/collapse transitions.
 * - Accessible markup with proper ARIA attributes.
 */

interface FAQ {
	id: number
	question: string
	answer: string
}

interface FAQsCardProps {
	faqs: FAQ
}

function FAQsCard({ faqs }: FAQsCardProps) {
	return (
		<main className={style.wrapper}>
			<article className={style.card}>
				<div className={style.content}>
					<details className={style.details} key={faqs.id}>
						<summary className={style.summary}>
							<p className={style.summaryContent}>
								<strong>Q{faqs.id}:</strong>
								<span>{faqs.question}</span>
							</p>
							<span className={style.iconChevron} />
						</summary>
						<p className={style.answer}>{faqs.answer}</p>
					</details>
				</div>
			</article>
		</main>
	)
}

/**
 * **Form-integrated FAQ input** with expandable layout.
 *
 * Interactive form component for creating/editing FAQs with the same expandable layout.
 * Question input in summary, answer input in expandable details content.
 *
 * Example:
 * ```tsx
 * <FAQsCardInput
 *   questionFieldName="question"
 *   answerFieldName="answer"
 *   form={form}
 *   faqNumber={1}
 * />
 * ```
 *
 * Notes:
 * - React Hook Form integration with type-safe field paths.
 * - Question input always visible in summary.
 * - Answer input in expandable details content.
 * - Native browser expand/collapse behavior.
 */

function FAQsCardInput<T extends FieldValues>({
	questionFieldName,
	answerFieldName,
	form,
	faqNumber,
	questionPlaceholder = 'Enter question...',
	answerPlaceholder = 'Enter answer...',
}: {
	questionFieldName: Path<T>
	answerFieldName: Path<T>
	form: UseFormReturn<T>
	faqNumber?: number
	questionPlaceholder?: string
	answerPlaceholder?: string
}) {
	return (
		<main className={style.wrapper}>
			<article className={style.card}>
				<div className={style.content}>
					<details className={style.details}>
						<summary className={style.summary}>
							<div className={style.summaryContent}>
								{/* Question Field in Summary */}
								<FormField
									control={form.control}
									name={questionFieldName}
									render={({ field }) => (
										<FormItem>
											<div className={style.questionContent}>
												<strong>{faqNumber ? `Q${faqNumber}:` : 'Q:'}</strong>
												<FormControl>
													<Input
														type="text"
														placeholder={questionPlaceholder}
														radius="md"
														{...field}
														className={style.input}
														onClick={e => e.stopPropagation()}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<span className={style.iconChevron} />
						</summary>

						{/* Answer Field in Details Content */}
						<div className={style.answer}>
							<FormField
								control={form.control}
								name={answerFieldName}
								render={({ field }) => (
									<FormItem>
										<div className={style.answerContent}>
											<strong>Answer:</strong>
											<FormControl>
												<Input
													type="text"
													placeholder={answerPlaceholder}
													radius="md"
													{...field}
													className={style.input}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</details>
				</div>
			</article>
		</main>
	)
}

export { FAQsCard, FAQsCardInput }
