import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import {
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from '@/components/atoms/form/Form'
import style from './Textarea.module.scss'

/**
 * **Flexible textarea** with optional icons and customizable styling.
 *
 * Supports multi-line text input with left/right icon placement and border radius options.
 * Built with accessibility features and WCAG compliance.
 *
 * Example:
 * ```tsx
 * <Textarea
 *   leftIcon={<MessageIcon />}
 *   placeholder="Enter your message"
 *   radius="lg"
 *   rows={4}
 * />
 * ```
 *
 * Notes:
 * - Supports multi-line text input.
 * - Optional left and right icon placement.
 * - Automatic wrapper styling based on icon presence.
 * - Configurable rows and resize behavior.
 */

type TextareaProps = {
	className?: string
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
	rows?: number
	resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<'textarea'> & TextareaProps
>(
	(
		{
			id,
			className = '',
			leftIcon,
			rightIcon,
			radius = 'md',
			rows = 4,
			resize = 'vertical',
			...props
		},
		ref
	) => {
		const wrapperClasses = `${leftIcon || rightIcon ? style.iconWrapper : style.textareaWrapper} ${style[`radius--${radius}`]} ${className}`
		const textareaClasses = `${style.textarea} ${className}`

		return (
			<main className={wrapperClasses} id={id}>
				{leftIcon && <div className={style.textareaIcon}>{leftIcon}</div>}
				<textarea ref={ref} className={textareaClasses} rows={rows} style={{ resize }} {...props} />
				{rightIcon && <div className={style.textareaIcon}>{rightIcon}</div>}
			</main>
		)
	}
)

Textarea.displayName = 'Textarea'

/** React Hook Form integrated textarea component wrapper. */
function FormTextarea<T extends FieldValues>({
	name,
	label,
	form,
	placeholder,
	...textareaProps
}: Omit<TextareaProps, 'value' | 'onChange' | 'inputRef' | 'onBlur' | 'name'> & {
	label?: string
	form: UseFormReturn<T>
	name: Path<T>
	placeholder?: string
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Textarea
							data-control="textarea"
							placeholder={placeholder}
							{...field}
							{...textareaProps} // Spread all props including radius, className, etc.
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { Textarea, FormTextarea }
