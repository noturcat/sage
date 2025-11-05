import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { RichTextEditorInput } from '@/components/atoms/rich-text-editor/RichTextEditor'
import style from './ThreadInfoCard.module.scss'

/**
 * **Versatile information display card** with structured format.
 *
 * Flexible card component designed to display labeled information with prominent label section
 * and content area. Supports both text and React components with optional italic styling.
 *
 * Example:
 * ```tsx
 * <ThreadInfoCard label="INGREDIENTS" italic>
 *   <p>List of ingredients here...</p>
 * </ThreadInfoCard>
 * ```
 *
 * Notes:
 * - Clean label and content separation with semantic structure.
 * - Flexible content support for strings and React components.
 * - Optional italic text styling for emphasis.
 * - Responsive design with consistent spacing and typography.
 */

interface ThreadInfoCardProps {
	label: string
	children: React.ReactNode
	italic?: boolean
	description?: string
}

function ThreadInfoCard({ label, children, italic = false, description }: ThreadInfoCardProps) {
	return (
		<main className={style.wrapper}>
			<p className={style.label}>{label}</p>
			{description && <p className={style.description}>{description}</p>}
			<article className={style.card}>
				<div className={`${style.content} ${italic ? style.italic : ''}`}>{children}</div>
			</article>
		</main>
	)
}

/**
 * **Form-integrated protocol info input** with rich text editor.
 *
 * Form component for creating/editing protocol information with the same layout structure.
 * Features rich text editor, optional description, and React Hook Form integration.
 *
 * Example:
 * ```tsx
 * <ThreadInfoCardInput
 *   fieldName="content"
 *   label="Protocol Steps"
 *   description="Describe the detailed steps"
 *   form={form}
 * />
 * ```
 *
 * Notes:
 * - Exact same layout structure as display ProtocolInfoCard.
 * - Rich text editor for protocol content input.
 * - Full React Hook Form integration with type-safe field paths.
 * - Optional description text and required field indicator.
 */

function ThreadInfoCardInput<T extends FieldValues>({
	fieldName,
	label,
	form,
	description,
	placeholder = 'Start typing...',
	required = false,
}: {
	fieldName: Path<T>
	label: string
	form: UseFormReturn<T>
	description?: string
	placeholder?: string
	required?: boolean
}) {
	return (
		<main className={style.wrapper}>
			<p className={style.label}>
				{label}
				{required && <span className={style.required}>*</span>}
			</p>
			{description && <p className={style.description}>{description}</p>}
			<RichTextEditorInput
				name={fieldName}
				form={form}
				placeholder={placeholder}
				withBorder={false}
			/>
		</main>
	)
}

export { ThreadInfoCard, ThreadInfoCardInput }
