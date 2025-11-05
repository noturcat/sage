import { useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormMessage, FormField, FormItem } from '@/components/atoms/form/Form'

import style from './RadioGroup.module.scss'

interface Options {
	label: string
	value: string
}

interface RadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
	options: Options[]
	label?: string
	align?: 'horizontal' | 'vertical'
	withBorder?: boolean
	required?: boolean
	className?: string
}

function RadioGroup({
	options,
	label,
	align = 'vertical',
	withBorder = false,
	required = false,
	className,
	...props
}: RadioGroupProps) {
	const [selected, setSelected] = useState<string>(options[0].value)

	return (
		<main className={`${style.wrapper} ${className}`}>
			{label && (
				<span className={style.label}>
					{label} {required && <span className={style.required}>*</span>}
				</span>
			)}
			<section className={style.radioGroup} data-align={align} data-with-border={withBorder}>
				{options.map((option, index) => (
					<div key={index} className={style.radioItem}>
						<input
							type="radio"
							id={option.value}
							className={style.radio}
							checked={selected === option.value}
							onChange={() => setSelected(option.value)}
							{...props}
						/>
						<label htmlFor={option.value} className={style.radioLabel}>
							{option.label}
						</label>
					</div>
				))}
			</section>
		</main>
	)
}

interface FormRadioGroupProps<T extends FieldValues> {
	align?: 'horizontal' | 'vertical'
	options: Options[]
	name: Path<T>
	form: UseFormReturn<T>
}

function FormRadioGroup<T extends FieldValues>({
	align = 'vertical',
	options,
	name,
	form,
	...props
}: FormRadioGroupProps<T> & RadioGroupProps) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<RadioGroup align={align} options={options} {...field} {...props} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { RadioGroup, FormRadioGroup }
