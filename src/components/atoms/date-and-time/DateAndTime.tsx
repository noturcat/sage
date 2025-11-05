import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/atoms/form/Form'
import Select from '@/components/atoms/modal/select/Select'
import ButtonIcon from '../button/ButtonIcon'
import style from './DateAndTime.module.scss'

/**
 * **Date and Time Input** component with three fields: date, time, and timezone.
 *
 * Displays three input fields horizontally with appropriate icons for each field.
 * Built with accessibility features and WCAG compliance.
 *
 * Example:
 * ```tsx
 * <DateAndTime
 *   dateValue="2024-01-15"
 *   timeValue="14:30"
 *   timezoneValue="UTC"
 *   onDateChange={(date) => console.log(date)}
 *   onTimeChange={(time) => console.log(time)}
 *   onTimezoneChange={(timezone) => console.log(timezone)}
 * />
 * ```
 *
 * Notes:
 * - Three horizontal input fields with icons.
 * - Date input with calendar icon.
 * - Time input with clock icon.
 * - Timezone select with globe icon.
 */

type DateAndTimeProps = {
	className?: string
	dateValue?: string
	enddateValue?: string
	timeValue?: string
	timezoneValue?: string
	onDateChange?: (date: string) => void
	onEndDateChange?: (date: string) => void
	onTimeChange?: (time: string) => void
	onTimezoneChange?: (timezone: string) => void
	disabled?: boolean
	error?: boolean
}

const DateAndTime = React.forwardRef<HTMLDivElement, DateAndTimeProps>(
	(
		{
			className,
			dateValue,
			enddateValue,
			timeValue,
			timezoneValue,
			onDateChange,
			onEndDateChange,
			onTimeChange,
			onTimezoneChange,
			disabled = false,
			error = false,
		},
		ref
	) => {
		const dateInputRef = React.useRef<HTMLInputElement>(null)
		const timeInputRef = React.useRef<HTMLInputElement>(null)
		const endDateInputRef = React.useRef<HTMLInputElement>(null)
		// Common timezone options
		const timezoneOptions = [
			{ value: 'EST', label: 'EST (UTC-5)' },
			{ value: 'PST', label: 'PST (UTC-8)' },
			{ value: 'CST', label: 'CST (UTC-6)' },
			{ value: 'MST', label: 'MST (UTC-7)' },
			{ value: 'GMT', label: 'GMT (UTC+0)' },
			{ value: 'CET', label: 'CET (UTC+1)' },
			{ value: 'JST', label: 'JST (UTC+9)' },
		]

		// Handle calendar icon click to focus date input
		const handleCalendarIconClick = () => {
			if (!disabled && dateInputRef.current) {
				dateInputRef.current.focus()
				// Try to open the native date picker if supported
				if (dateInputRef.current.showPicker) {
					dateInputRef.current.showPicker()
				} else {
					// Fallback: trigger click on the input
					dateInputRef.current.click()
				}
			}
		}

		// Handle time icon click to focus time input
		const handleTimeIconClick = () => {
			if (!disabled && timeInputRef.current) {
				timeInputRef.current.focus()
				// Try to open the native time picker if supported
				if (timeInputRef.current.showPicker) {
					timeInputRef.current.showPicker()
				} else {
					// Fallback: trigger click on the input
					timeInputRef.current.click()
				}
			}
		}

		const handleEndDateIconClick = () => {
			if (!disabled && endDateInputRef.current) {
				endDateInputRef.current.focus()
				// Try to open the native date picker if supported
				if (endDateInputRef.current.showPicker) {
					endDateInputRef.current.showPicker()
				} else {
					// Fallback: trigger click on the input
					endDateInputRef.current.click()
				}
			}
		}

		return (
			<div ref={ref} className={`${style.dateTimeContainer} ${className}`}>
				<div className={style.inputsRow}>
					{dateValue !== undefined && (
						<div className={style.inputGroup}>
							<div
								className={style.inputWrapper}
								onClick={handleCalendarIconClick}
								aria-label="Open date picker"
								role="button"
								tabIndex={disabled ? -1 : 0}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleCalendarIconClick()
									}
								}}
							>
								<div className={style.clickableIcon}>
									<ButtonIcon icon="/icons/date.svg" variant="text" styleType="solid" />
								</div>
								<div className={style.dateInputWrapper}>
									<input
										ref={dateInputRef}
										type="date"
										className={`${style.dateInput} ${error ? style.error : ''}`}
										value={dateValue}
										onChange={e => onDateChange?.(e.target.value)}
										disabled={disabled}
									/>
									{!dateValue && <div className={style.datePlaceholder}>Start date</div>}
								</div>
							</div>
						</div>
					)}
					{enddateValue !== undefined && (
						<div className={style.inputGroup}>
							<div
								className={style.inputWrapper}
								onClick={handleEndDateIconClick}
								aria-label="Open date picker"
								role="button"
								tabIndex={disabled ? -1 : 0}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleEndDateIconClick()
									}
								}}
							>
								<div className={style.clickableIcon}>
									<ButtonIcon icon="/icons/date.svg" variant="text" styleType="solid" />
								</div>
								<div className={style.dateInputWrapper}>
									<input
										ref={endDateInputRef}
										type="date"
										className={`${style.dateInput} ${error ? style.error : ''}`}
										value={enddateValue}
										onChange={e => onEndDateChange?.(e.target.value)}
										disabled={disabled}
									/>
									{!enddateValue && <div className={style.datePlaceholder}>End date</div>}
								</div>
							</div>
						</div>
					)}
					{timeValue !== undefined && (
						<div className={style.inputGroup}>
							<div
								className={style.inputWrapper}
								onClick={handleTimeIconClick}
								aria-label="Open time picker"
								role="button"
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleTimeIconClick()
									}
								}}
								tabIndex={disabled ? -1 : 0}
							>
								<div className={style.clickableIcon}>
									<ButtonIcon icon="/icons/time.svg" variant="text" styleType="solid" />
								</div>
								<div className={style.timeInputWrapper}>
									<input
										ref={timeInputRef}
										type="time"
										className={`${style.timeInput} ${error ? style.error : ''}`}
										value={timeValue}
										onChange={e => onTimeChange?.(e.target.value)}
										disabled={disabled}
									/>
									{!timeValue && <div className={style.timePlaceholder}>Start time</div>}
								</div>
							</div>
						</div>
					)}
					{timezoneValue !== undefined && (
						<div className={style.inputGroup}>
							<div className={style.inputWrapper}>
								<div className={style.clickableIcon}>
									<ButtonIcon icon="/icons/timezone.svg" variant="text" styleType="solid" />
								</div>
								<div className={style.timezoneInputWrapper}>
									<Select
										placeholder="Time Zone"
										options={timezoneOptions}
										value={timezoneValue || ''}
										onValueChange={onTimezoneChange}
										disabled={disabled}
										className={style.timezoneSelect}
										inputClassName={`${style.timezoneInput} ${error ? style.error : ''}`}
									/>
									{!timezoneValue && <div className={style.timezonePlaceholder}>Time Zone</div>}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}
)

DateAndTime.displayName = 'DateAndTime'

/** React Hook Form integrated DateAndTime component wrapper. */
function FormDateAndTime<T extends FieldValues>({
	form,
	className,
	...dateTimeProps
}: Omit<
	DateAndTimeProps,
	'dateValue' | 'timeValue' | 'timezoneValue' | 'onDateChange' | 'onTimeChange' | 'onTimezoneChange'
> & {
	form: UseFormReturn<T>
}) {
	return (
		<FormField
			control={form.control}
			name={'dateTime' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<DateAndTime
							{...dateTimeProps}
							className={className}
							dateValue={field.value?.date || ''}
							timeValue={field.value?.time || ''}
							timezoneValue={field.value?.timezone || ''}
							onDateChange={date => field.onChange({ ...field.value, date })}
							onTimeChange={time => field.onChange({ ...field.value, time })}
							onTimezoneChange={timezone => field.onChange({ ...field.value, timezone })}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { DateAndTime, FormDateAndTime }
