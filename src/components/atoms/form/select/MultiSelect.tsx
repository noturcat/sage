'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useInteractions,
	useDismiss,
} from '@floating-ui/react'
import CustomButton from '@/components/atoms/button/CustomButton'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/atoms/form/Form'
import isPrintableKey from '@/components/atoms/form/select/hooks/useTypeahead'
import styles from './MultiSelect.module.scss'

/**
 * **Custom accessible multiselect** with advanced keyboard navigation.
 *
 * Supports both controlled and uncontrolled usage with comprehensive keyboard navigation,
 * typeahead search, smart positioning, and React Hook Form integration.
 * Allows multiple option selection with visual indicators.
 *
 * Example:
 * ```tsx
 * <MultiSelect
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' }
 *   ]}
 *   placeholder="Choose fruits"
 *   value={['apple']}
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 *
 * Notes:
 * - Full keyboard navigation (arrows, home/end, enter/space, escape).
 * - Typeahead search functionality.
 * - Smart dropdown positioning with collision detection.
 * - ARIA compliance for screen readers.
 * - Multiple selection with checkboxes and tags display.
 */

type Option = { value: string; label: React.ReactNode; searchText?: string }

type MultiSelectProps = {
	variant?: 'default' | 'icon'
	options: Option[]
	name?: string
	placeholder?: React.ReactNode
	value?: string[] | undefined // controlled
	defaultValue?: string[] | undefined // uncontrolled
	onChange?: (value: string[] | undefined) => void
	onBlur?: () => void // for RHF
	onFocus?: () => void // for RHF
	inputRef?: React.Ref<HTMLInputElement> // for RHF registration
	disabled?: boolean
	className?: string
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
	showSelectedCount?: boolean // show count of selected items
}

function MultiSelect({
	variant = 'default',
	options,
	name,
	placeholder = 'Select',
	value,
	defaultValue,
	onChange,
	onBlur,
	onFocus,
	inputRef,
	disabled,
	className = '',
	radius = 'md',
	showSelectedCount = true,
}: MultiSelectProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const optionRefs = useRef<Array<HTMLDivElement | null>>([])

	// controlled / uncontrolled
	const [internal, setInternal] = useState<string[] | undefined>(defaultValue)
	// treat as controlled if value is defined
	const controlled = value !== undefined

	// always show internal first (we keep it in sync with value below)
	const selected = controlled ? value : internal

	// keep internal in sync with external value so re-opens show correct state
	useEffect(() => {
		if (controlled) setInternal(value)
	}, [controlled, value])

	const [isOpen, setIsOpen] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const listboxId = useId()
	const triggerId = useId()

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(8), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	const dismiss = useDismiss(context, {
		escapeKey: false,
	})

	const { getFloatingProps } = useInteractions([dismiss])

	const selectedValues = selected || []
	const selectedOptions = options.filter(o => selectedValues.includes(o.value))

	const [containerWidth, setContainerWidth] = useState(0)
	const [visibleItems, setVisibleItems] = useState(selectedOptions.length)

	const calculateVisibleItems = useCallback(() => {
		const element = refs.reference.current
		if (
			!element ||
			!(element instanceof Element) ||
			selectedOptions.length === 0 ||
			containerWidth === 0
		) {
			return selectedOptions.length
		}

		const chevronWidth = 24
		const padding = 32
		const availableWidth = Math.max(200, containerWidth - chevronWidth - padding)

		const avgCharWidth = 8
		let visibleCount = 0
		let totalWidth = 0

		for (let i = 0; i < selectedOptions.length; i++) {
			const option = selectedOptions[i]
			const labelText = typeof option.label === 'string' ? option.label : option.value
			const estimatedWidth = labelText.length * avgCharWidth + 16 // 16px for padding

			if (totalWidth + estimatedWidth <= availableWidth) {
				totalWidth += estimatedWidth
				visibleCount++
			} else {
				break
			}
		}

		return Math.max(1, visibleCount)
	}, [selectedOptions, containerWidth, refs.reference])

	useEffect(() => {
		const element = refs.reference.current
		if (!element || !(element instanceof Element)) return

		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width)
			}
		})

		resizeObserver.observe(element)

		return () => {
			resizeObserver.disconnect()
		}
	}, [refs.reference])

	useEffect(() => {
		setVisibleItems(calculateVisibleItems())
	}, [calculateVisibleItems])

	const handleSelect = useCallback(
		(val: string) => {
			const current = controlled ? value : internal
			const currentValues = current || []

			const nextValues = currentValues.includes(val)
				? currentValues.filter(v => v !== val)
				: [...currentValues, val]

			setInternal(nextValues)
			onChange?.(nextValues)
		},
		[controlled, value, internal, onChange]
	)

	const bufferRef = useRef('')
	const timerRef = useRef<number | null>(null)
	const pushChar = (ch: string) => {
		bufferRef.current += ch
		if (timerRef.current) window.clearTimeout(timerRef.current)
		timerRef.current = window.setTimeout(() => (bufferRef.current = ''), 500)
	}

	const textFor = (o: Option) => (typeof o.label === 'string' ? o.label : (o.searchText ?? ''))

	const findNext = (q: string, startFrom: number) => {
		const query = q.toLowerCase()
		const fwd = options
			.slice(startFrom + 1)
			.findIndex(o => textFor(o).toLowerCase().startsWith(query))
		if (fwd >= 0) return startFrom + 1 + fwd
		return options.findIndex(o => textFor(o).toLowerCase().startsWith(query))
	}

	// keep highlighted item visible
	useEffect(() => {
		if (isOpen && highlightedIndex >= 0) {
			optionRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
		}
	}, [highlightedIndex, isOpen])

	// keyboard on trigger
	const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (isPrintableKey(e)) {
			pushChar(e.key.toLowerCase())
			if (!isOpen) {
				setIsOpen(true)
				setHighlightedIndex(findNext(bufferRef.current, -1) || 0)
				return
			}
			const base = highlightedIndex >= 0 ? highlightedIndex : -1
			const match = findNext(bufferRef.current, base)
			if (match >= 0) setHighlightedIndex(match)
			return
		}

		if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			setIsOpen(true)
			setHighlightedIndex(0)
			return
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setHighlightedIndex(i => (i < 0 ? 0 : (i + 1) % options.length))
				break
			case 'ArrowUp':
				e.preventDefault()
				setHighlightedIndex(i => (i <= 0 ? options.length - 1 : i - 1))
				break
			case 'Home':
				e.preventDefault()
				setHighlightedIndex(0)
				break
			case 'End':
				e.preventDefault()
				setHighlightedIndex(options.length - 1)
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (isOpen && highlightedIndex >= 0) {
					handleSelect(options[highlightedIndex].value)
				} else {
					setIsOpen(true)
				}
				bufferRef.current = ''
				break
			case 'Escape':
				e.preventDefault()
				setIsOpen(false)
				bufferRef.current = ''
				break
			case 'Tab':
				setIsOpen(false)
				break
		}
	}

	// Memoized render trigger content for better performance
	const renderTriggerContent = useMemo(() => {
		if (selectedValues.length === 0) {
			return placeholder
		}

		if (variant === 'icon') {
			return showSelectedCount ? selectedValues.length : '•'
		}

		const displayItems = selectedOptions.slice(0, visibleItems)
		const remainingCount = selectedValues.length - visibleItems

		return (
			<div className={styles.triggerContent}>
				{displayItems.map(option => (
					<span key={option.value} className={styles.selectedTag}>
						<span className={styles.selectedLabel}>{option.label}</span>
						<span
							className={styles.iconClose}
							onClick={e => {
								e.stopPropagation()
								handleSelect(option.value)
							}}
						/>
					</span>
				))}
				{remainingCount > 0 && <span className={styles.moreCount}>+{remainingCount} more</span>}
			</div>
		)
	}, [
		selectedValues.length,
		variant,
		showSelectedCount,
		selectedOptions,
		visibleItems,
		placeholder,
		handleSelect,
	])

	return (
		<div
			ref={rootRef}
			className={styles.multiSelect}
			data-disabled={disabled || undefined}
			data-variant={variant}
		>
			{name && (
				<input
					ref={inputRef}
					type="hidden"
					name={name}
					value={JSON.stringify(selectedValues)}
					disabled={disabled}
					onBlur={onBlur}
					onFocus={onFocus}
				/>
			)}
			<CustomButton
				id={triggerId}
				ref={refs.setReference}
				type="button"
				variant="secondary"
				radius={radius}
				className={`${styles.trigger} ${className}`}
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				aria-activedescendant={
					isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
				}
				onFocus={onFocus}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				onClick={() => {
					setIsOpen(o => {
						const next = !o
						if (next) setHighlightedIndex(0)
						return next
					})
				}}
			>
				{renderTriggerContent}
				<span className={styles.iconChevron} data-open={isOpen} />
			</CustomButton>

			{isOpen && (
				<div
					id={listboxId}
					ref={refs.setFloating}
					className={styles.content}
					role="listbox"
					aria-labelledby={triggerId}
					aria-multiselectable="true"
					style={floatingStyles}
					{...getFloatingProps()}
				>
					<div className={styles.options}>
						{options.map((o, idx) => {
							const isSelected = selectedValues.includes(o.value)
							const isHighlighted = idx === highlightedIndex
							const labelText = typeof o.label === 'string' ? o.label : o.value

							return (
								<div
									key={o.value}
									id={`${listboxId}-option-${idx}`}
									role="option"
									aria-selected={isSelected}
									ref={el => {
										optionRefs.current[idx] = el
									}}
									className={`${styles.option} ${isHighlighted ? styles.highlighted : ''} ${isSelected ? styles.selected : ''}`}
									onMouseDown={e => {
										e.preventDefault()
										e.stopPropagation()
										handleSelect(o.value)
									}}
									onMouseEnter={() => setHighlightedIndex(idx)}
								>
									<span className={styles.optionInner}>
										<abbr title={labelText} className={styles.optionAbbr}>
											{o.label}
										</abbr>
										{o.searchText && <span className={styles.optionText}>{o.searchText}</span>}
									</span>
									{isSelected && <span className={styles.iconCheck} />}
								</div>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

function MultiSelectInput<T extends FieldValues>({
	options,
	name,
	label,
	form,
	...multiSelectProps
}: Omit<MultiSelectProps, 'value' | 'onChange' | 'inputRef' | 'onBlur' | 'name'> & {
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
						<MultiSelect
							options={options}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							inputRef={field.ref}
							data-control="multiselect"
							{...multiSelectProps}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { MultiSelect, MultiSelectInput }
