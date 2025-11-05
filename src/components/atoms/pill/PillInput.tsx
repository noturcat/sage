import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import Pill from '@/components/atoms/pill/Pill'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/atoms/form/Form'
import style from './PillInput.module.scss'

interface options {
	label: string
	value: string
}

export type PillInputProps = {
	options: options[]
	value?: { value: string }[]
	onChange?: (values: { value: string }[]) => void
	placeholder?: string
	maxSelection?: number
	className?: string
}

function PillInput({
	options,
	value = [],
	onChange,
	placeholder,
	maxSelection,
	className,
}: PillInputProps) {
	// Convert schema format [{ value: 'wellness' }] to internal format ['wellness']
	const selectedValues = value.map(item => item.value)

	const handleToggle = (optionValue: string) => {
		let newValues: string[]

		if (selectedValues.includes(optionValue)) {
			// Remove if already selected
			newValues = selectedValues.filter(v => v !== optionValue)
		} else {
			// Add if not selected (check max selection limit)
			if (maxSelection && selectedValues.length >= maxSelection) {
				return // Don't add if max reached
			}
			newValues = [...selectedValues, optionValue]
		}

		// Convert back to schema format [{ value: 'wellness' }]
		const schemaValues = newValues.map(val => ({ value: val }))
		onChange?.(schemaValues)
	}

	const handleRemove = (optionValue: string, event: React.MouseEvent) => {
		event.stopPropagation()
		const newValues = selectedValues.filter(v => v !== optionValue)

		// Convert back to schema format [{ value: 'wellness' }]
		const schemaValues = newValues.map(val => ({ value: val }))
		onChange?.(schemaValues)
	}

	return (
		<div className={`${style.pillContainer} ${className || ''}`}>
			{selectedValues.length === 0 && <span className={style.placeholder}>{placeholder}</span>}

			<div className={style.pillGrid}>
				{options.map(option => {
					const isSelected = selectedValues.includes(option.value)
					const isDisabled = !isSelected && maxSelection && selectedValues.length >= maxSelection

					return (
						<Pill
							key={option.value}
							variant={isSelected ? 'primary' : 'outline'}
							radius="full"
							className={`${style.pill} ${isSelected ? style.selected : ''} ${isDisabled ? style.disabled : ''}`}
							onClick={() => !isDisabled && handleToggle(option.value)}
							data-selected={isSelected}
							role="button"
							tabIndex={isDisabled ? -1 : 0}
							aria-pressed={isSelected}
							onKeyDown={e => {
								if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
									e.preventDefault()
									handleToggle(option.value)
								}
							}}
						>
							<span className={style.pillLabel}>#{option.label}</span>
							{isSelected && (
								<span className={style.iconRemove} onClick={e => handleRemove(option.value, e)} />
							)}
						</Pill>
					)
				})}
			</div>

			{maxSelection && (
				<div className={style.counter}>
					{selectedValues.length} / {maxSelection} selected
				</div>
			)}
		</div>
	)
}

/** React Hook Form integrated pill input wrapper. */
function PillInputForm<T extends FieldValues>({
	name,
	label,
	form,
	options,
	placeholder,
	maxSelection,
	required,
}: {
	name: Path<T>
	label?: string
	form: UseFormReturn<T>
	options: options[]
	placeholder?: string
	maxSelection?: number
	description?: string
	required?: boolean
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && (
						<label className={style.formLabel}>
							{label} {required && <span className={style.required}>*</span>}
						</label>
					)}
					<FormControl>
						<PillInput
							{...field}
							options={options}
							placeholder={placeholder}
							maxSelection={maxSelection}
						/>
					</FormControl>

					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { PillInput, PillInputForm }
export default PillInput
