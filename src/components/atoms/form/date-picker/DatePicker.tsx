'use client'

import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { DateRange, DayPicker } from 'react-day-picker'
import { format, isValid, parse } from 'date-fns'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useClick,
	useDismiss,
	useRole,
	useInteractions,
} from '@floating-ui/react'
import CustomButton from '@/components/atoms/button/CustomButton'
import { Input } from '@/components/atoms/input/Input'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/atoms/form/Form'

import 'react-day-picker/style.css'
import styles from './DatePicker.module.scss'

/**
 * **Custom accessible date picker** following DayPicker documentation.
 *
 * Implements dialog-based date picker with input field functionality,
 * smart positioning, and React Hook Form integration.
 * Supports both single date and date range selection.
 * Enforces MM/DD/YYYY format for input and display.
 *
 * Example:
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select date"
 * />
 * ```
 *
 * Notes:
 * - Follows official DayPicker input field patterns.
 * - Smart dropdown positioning with collision detection.
 * - ARIA compliance for screen readers.
 * - Single date or date range selection.
 * - Enforces MM/DD/YYYY format for input and display.
 */

type DatePickerMode = 'single' | 'range'
type DatePickerValue = Date | DateRange | undefined

type DatePickerProps = {
	mode?: DatePickerMode
	value?: DatePickerValue
	defaultValue?: DatePickerValue
	onChange?: (value: DatePickerValue) => void
	onBlur?: () => void
	onFocus?: () => void
	inputRef?: React.Ref<HTMLInputElement>
	placeholder?: string
	disabled?: boolean
	className?: string
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
	name?: string
	markers?: Date[]
	country?: string
	showHolidays?: boolean
}

function DatePicker({
	mode = 'single',
	value,
	defaultValue,
	onChange,
	onBlur,
	onFocus,
	inputRef,
	placeholder = 'MM/DD/YYYY',
	disabled,
	className = '',
	radius = 'md',
	name,
}: DatePickerProps) {
	const inputId = useId()
	const calendarId = useId()
	const triggerId = useId()

	const displayFormat = 'MM/dd/yyyy'

	const [month, setMonth] = useState(new Date())
	const [internal, setInternal] = useState<Date | DateRange | undefined>(defaultValue)
	const [inputValue, setInputValue] = useState('')
	const [isOpen, setIsOpen] = useState(false)

	// controlled / uncontrolled
	const controlled = value !== undefined
	const selected = controlled ? value : internal

	// keep internal in sync with external value so re-opens show correct state
	useEffect(() => {
		if (controlled) setInternal(value)
	}, [controlled, value])

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(8), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	const click = useClick(context)
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'dialog' })

	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

	// sync input value and month with selected date
	useEffect(() => {
		if (selected) {
			const date = mode === 'single' ? (selected as Date) : (selected as DateRange)?.from
			if (date) {
				setInputValue(format(date, displayFormat))
				setMonth(date)
			}
		} else {
			setInputValue('')
		}
	}, [selected, mode, displayFormat])

	const handleDayPickerSelect = useCallback(
		(date: Date | DateRange | undefined) => {
			const current = controlled ? value : internal
			const next = current === date ? undefined : date
			setInternal(next)
			onChange?.(next)
			setIsOpen(false)
		},
		[controlled, value, internal, onChange]
	)

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const inputValue = e.target.value

			const sanitizedValue = inputValue.replace(/[^\d/]/g, '')

			if (sanitizedValue.length > 10) {
				return
			}

			let formattedValue = sanitizedValue
			if (sanitizedValue.length >= 2 && !sanitizedValue.includes('/')) {
				formattedValue = sanitizedValue.slice(0, 2) + '/' + sanitizedValue.slice(2)
			}
			if (sanitizedValue.length >= 5 && sanitizedValue.split('/').length === 2) {
				const parts = sanitizedValue.split('/')
				if (parts[1].length >= 2) {
					formattedValue = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2)
				}
			}

			setInputValue(formattedValue)

			const parsedDate = parse(formattedValue, displayFormat, new Date())

			if (isValid(parsedDate) && formattedValue.length === 10) {
				setInternal(parsedDate)
				setMonth(parsedDate)
				onChange?.(parsedDate)
			} else {
				setInternal(undefined)
				onChange?.(undefined)
			}
		},
		[displayFormat, onChange]
	)

	const dayPickerProps = useMemo(() => {
		if (mode === 'single') {
			return {
				captionLayout: 'dropdown' as const,
				month,
				onMonthChange: setMonth,
				autoFocus: true,
				mode: 'single' as const,
				selected: selected as Date | undefined,
				onSelect: handleDayPickerSelect,
				showOutsideDays: true,
				fixedWeeks: true,
				weekStartsOn: 1 as const,
				navLayout: 'after' as const,
			}
		}

		return {
			captionLayout: 'dropdown' as const,
			month,
			onMonthChange: setMonth,
			autoFocus: true,
			mode: 'range' as const,
			selected: selected as DateRange | undefined,
			onSelect: handleDayPickerSelect,
			showOutsideDays: true,
			fixedWeeks: true,
			weekStartsOn: 1 as const,
			navLayout: 'after' as const,
			...(selected &&
				typeof selected === 'object' &&
				'from' in selected && {
					footer: `Selected: ${(selected as DateRange).from?.toDateString() || 'No start date'} - ${(selected as DateRange).to?.toDateString() || 'No end date'}`,
				}),
		}
	}, [month, mode, selected, handleDayPickerSelect])

	const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			setIsOpen(true)
		}
	}, [])

	const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (
			!isOpen &&
			(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')
		) {
			e.preventDefault()
			setIsOpen(true)
			return
		}

		switch (e.key) {
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (!isOpen) {
					setIsOpen(true)
				}
				break
			case 'Escape':
				e.preventDefault()
				setIsOpen(false)
				break
			case 'Tab':
				setIsOpen(false)
				break
		}
	}

	return (
		<div className={styles.datePicker} data-disabled={disabled || undefined}>
			<Input
				id={inputId}
				type="text"
				value={inputValue}
				placeholder={placeholder}
				onChange={handleInputChange}
				onFocus={onFocus}
				onBlur={onBlur}
				onKeyDown={handleInputKeyDown}
				disabled={disabled}
				className={className}
				ref={inputRef}
				name={name}
				rightIcon={
					<CustomButton
						id={triggerId}
						ref={refs.setReference}
						type="button"
						variant="secondary"
						radius={radius}
						className={styles.calendarButton}
						disabled={disabled}
						aria-controls={calendarId}
						aria-haspopup="dialog"
						aria-expanded={isOpen}
						aria-label="Open calendar to choose date"
						onKeyDown={onKeyDown}
						{...getReferenceProps()}
					>
						<span className={styles.iconCalendar} />
					</CustomButton>
				}
			/>

			<p aria-live="assertive" aria-atomic="true" className={styles.liveRegion}>
				{selected !== undefined
					? mode === 'single'
						? selected instanceof Date
							? selected.toDateString()
							: 'Invalid date'
						: selected && typeof selected === 'object' && 'from' in selected
							? `${(selected as DateRange).from?.toDateString() || 'No start date'} - ${(selected as DateRange).to?.toDateString() || 'No end date'}`
							: 'Invalid date range'
					: 'Please type or pick a date'}
			</p>

			{isOpen && (
				<div
					id={calendarId}
					ref={refs.setFloating}
					style={floatingStyles}
					className={styles.content}
					role="dialog"
					aria-modal="true"
					aria-labelledby={triggerId}
					{...getFloatingProps()}
				>
					<DayPicker {...dayPickerProps} />
				</div>
			)}
		</div>
	)
}

function DatePickerInput<T extends FieldValues>({
	placeholder,
	disabled,
	className,
	radius,
	label,
	form,
	name,
	...datePickerProps
}: Omit<DatePickerProps, 'value' | 'onChange' | 'inputRef' | 'onBlur' | 'name'> & {
	label?: string
	form: UseFormReturn<T>
	name: Path<T>
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<DatePicker
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							inputRef={field.ref}
							placeholder={placeholder}
							disabled={disabled}
							className={className}
							radius={radius}
							{...datePickerProps}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { DatePicker, DatePickerInput }
