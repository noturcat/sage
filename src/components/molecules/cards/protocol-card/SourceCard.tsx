import Link from 'next/link'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import Pill from '@/components/atoms/pill/Pill'
import { Input } from '@/components/atoms/input/Input'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/atoms/form/Form'
import style from './SourceCard.module.scss'

/**
 * **Interactive source card** with numbered badge and clickable link.
 *
 * Displays source information with numbered pill badge and clickable link to source URL.
 * Features external link handling with security attributes and responsive design.
 *
 * Example:
 * ```tsx
 * <SourceCard
 *   count={1}
 *   source="https://example.com/research-paper"
 * />
 * ```
 *
 * Notes:
 * - Numbered pill badge for source counting.
 * - Clickable link with external link handling.
 * - Security attributes (target="_blank", rel="noopener noreferrer").
 * - Responsive design with consistent spacing.
 */

interface SourceCardProps {
	count: number
	source: string
}

function SourceCard({ count, source }: SourceCardProps) {
	return (
		<div className={style.wrapper}>
			<Pill variant="primary" radius="full" className={style.pill}>
				{count}
			</Pill>
			<div className={style.card}>
				<Link href={source} target="_blank" rel="noopener noreferrer" className={style.content}>
					<span>{source}</span>
				</Link>
			</div>
		</div>
	)
}

/**
 * **Form-integrated source input** with numbered badge.
 *
 * Form component for creating/editing source URLs with the same layout structure.
 * Features numbered pill badge and text input field with React Hook Form integration.
 *
 * Example:
 * ```tsx
 * <SourceCardInput
 *   sourceFieldName="source"
 *   count={1}
 *   form={form}
 *   placeholder="https://example.com/research-paper"
 * />
 * ```
 *
 * Notes:
 * - Exact same layout structure as display SourceCard.
 * - Numbered pill badge matching display version styling.
 * - Text input field for source URL entry.
 * - Full React Hook Form integration with type-safe field paths.
 * - Error state handling with pill badge styling.
 */

function SourceCardInput<T extends FieldValues>({
	sourceFieldName,
	count,
	form,
	placeholder = 'Enter source URL...',
	className = '',
}: {
	sourceFieldName: Path<T>
	count: number
	form: UseFormReturn<T>
	placeholder?: string
	className?: string
}) {
	return (
		<div className={style.wrapper}>
			<Pill
				variant="primary"
				radius="full"
				className={style.pill}
				data-error={form.formState.errors[sourceFieldName] ? true : false}
			>
				{count}
			</Pill>

			<FormField
				control={form.control}
				name={sourceFieldName}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input
								type="url"
								placeholder={placeholder}
								radius="md"
								className={className}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

export { SourceCard, SourceCardInput }
