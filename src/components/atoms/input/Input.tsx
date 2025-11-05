import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import {
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from '@/components/atoms/form/Form'
import style from './Input.module.scss'

/**
 * **Flexible input** with optional icons and customizable styling.
 *
 * Supports all HTML input types with left/right icon placement and border radius options.
 * Built with accessibility features and WCAG compliance.
 *
 * Example:
 * ```tsx
 * <Input
 *   type="email"
 *   leftIcon={<EmailIcon />}
 *   placeholder="Enter email"
 *   radius="lg"
 * />
 * ```
 *
 * Notes:
 * - Supports all HTML input types.
 * - Optional left and right icon placement.
 * - Automatic wrapper styling based on icon presence.
 */

type InputProps = {
	type: React.HTMLInputTypeAttribute
	className?: string
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & InputProps>(
	({ id, type, className = '', leftIcon, rightIcon, radius = 'md', ...props }, ref) => {
		const wrapperClasses = ` ${leftIcon || rightIcon ? style.iconWrapper : style.inputWrapper} ${style[`inputWrapper--${radius}`]} ${className}`
		const inputClasses = `${style.input}`

		return (
			<div className={wrapperClasses} id={id}>
				{leftIcon && <div className={style.inputIcon}>{leftIcon}</div>}
				<input ref={ref} type={type} className={inputClasses} {...props} />
				{rightIcon && <div className={style.inputIcon}>{rightIcon}</div>}
			</div>
		)
	}
)

Input.displayName = 'Input'

/** React Hook Form integrated select component wrapper. */
function FormInput<T extends FieldValues>({
	type,
	name,
	label,
	form,
	placeholder,
	...inputProps
}: Omit<InputProps, 'value' | 'onChange' | 'inputRef' | 'onBlur' | 'name'> & {
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
						<Input
							type={type}
							data-control="input"
							placeholder={placeholder}
							{...field}
							{...inputProps} // Spread all props including radius, className, etc.
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { Input, FormInput }
