'use client'
import { useEffect, useMemo, useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import Holidays from 'date-holidays'

import 'react-day-picker/style.css'
import style from './Calendar.module.scss'

/**
 * **Calendar component** with date range selection and holiday support.
 *
 * Interactive calendar component with date range selection, holiday display, and custom markers.
 * Features responsive design and accessibility support.
 *
 * Example:
 * ```tsx
 * <Calendar
 *   value={dateRange}
 *   onChange={setDateRange}
 *   markers={[new Date()]}
 *   country="US"
 *   showHolidays={true}
 * />
 * ```
 *
 * Notes:
 * - Date range selection with visual feedback.
 * - Holiday display with configurable country.
 * - Custom markers for important dates.
 * - Responsive design with accessibility support.
 */

type CalendarProps = {
	value?: DateRange
	onChange?: (range: DateRange | undefined) => void
	markers?: Date[]
	country?: string
	showHolidays?: boolean
}

function startOfDay(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, amount: number): Date {
	const nd = new Date(d)
	nd.setDate(nd.getDate() + amount)
	return nd
}

function Calendar({
	value,
	onChange,
	markers = [],
	country = 'US',
	showHolidays = true,
}: CalendarProps) {
	const [selected, setSelected] = useState<DateRange | undefined>(value)
	const [holidays, setHolidays] = useState<Date[]>([])

	useEffect(() => {
		setSelected(value)
	}, [value])

	useEffect(() => {
		if (!showHolidays) {
			setHolidays([])
			return
		}

		try {
			const hd = new Holidays(country)
			const currentYear = new Date().getFullYear()
			const nextYear = currentYear + 1

			// Get holidays for current year and next year
			const currentYearHolidays = hd.getHolidays(currentYear)
			const nextYearHolidays = hd.getHolidays(nextYear)
			const allHolidays = [...currentYearHolidays, ...nextYearHolidays]

			const holidayDates = allHolidays
				.filter(holiday => holiday.type === 'public') // Only public holidays
				.map(holiday => {
					const date = new Date(holiday.date)
					return startOfDay(date)
				})
				.filter(date => !isNaN(date.getTime())) // Filter out invalid dates

			setHolidays(holidayDates)
		} catch (error) {
			console.warn('Failed to load holidays:', error)
			setHolidays([])
		}
	}, [country, showHolidays])

	const isInSelectedRange = useMemo(() => {
		return (d: Date): boolean => {
			if (!selected?.from || !selected?.to) return false
			const day = startOfDay(d).getTime()
			const from = startOfDay(selected.from).getTime()
			const to = startOfDay(selected.to).getTime()
			return day >= from && day <= to
		}
	}, [selected?.from, selected?.to])

	const markerSet = useMemo(() => {
		const allMarkers = [...markers, ...holidays]
		return new Set(allMarkers.map(d => startOfDay(d).getTime()))
	}, [markers, holidays])

	const modifiers = useMemo(
		() => ({
			segmentStart: (d: Date) => isInSelectedRange(d) && !isInSelectedRange(addDays(d, -1)),
			segmentEnd: (d: Date) => isInSelectedRange(d) && !isInSelectedRange(addDays(d, 1)),
			weekRightEdge: (d: Date) => isInSelectedRange(d) && d.getDay() === 0, // Sunday when weekStartsOn=1
			weekLeftEdge: (d: Date) => isInSelectedRange(d) && d.getDay() === 1, // Monday
			holiday: (d: Date) => markerSet.has(startOfDay(d).getTime()),
		}),
		[isInSelectedRange, markerSet]
	)

	return (
		<DayPicker
			mode="range"
			selected={selected}
			onSelect={range => {
				setSelected(range as DateRange | undefined)
				onChange?.(range as DateRange | undefined)
			}}
			showOutsideDays
			fixedWeeks
			weekStartsOn={1}
			modifiers={modifiers}
			navLayout="around"
			modifiersClassNames={{
				segmentStart: style.segmentStart,
				segmentEnd: style.segmentEnd,
				weekRightEdge: style.weekRightEdge,
				weekLeftEdge: style.weekLeftEdge,
				holiday: style.holiday,
			}}
			className={style.calendarTheme}
		/>
	)
}

export default Calendar
