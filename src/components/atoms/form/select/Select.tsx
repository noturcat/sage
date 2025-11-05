'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
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
import styles from './Select.module.scss'

/**
 * **Custom accessible select** with advanced keyboard navigation.
 *
 * Supports both controlled and uncontrolled usage with comprehensive keyboard navigation,
 * typeahead search, smart positioning, and React Hook Form integration.
 *
 * Example:
 * ```tsx
 * <Select
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' }
 *   ]}
 *   placeholder="Choose fruit"
 * />
 * ```
 *
 * Notes:
 * - Full keyboard navigation (arrows, home/end, enter/space, escape).
 * - Typeahead search functionality.
 * - Smart dropdown positioning with collision detection.
 * - ARIA compliance for screen readers.
 */

type Option = { value: string; label: React.ReactNode; searchText?: string }

type SelectProps = {
	variant?: 'default' | 'icon'
	options: Option[]
	name?: string
	placeholder?: React.ReactNode
	value?: string | undefined // controlled
	defaultValue?: string | undefined // uncontrolled
	leftIcon?: React.ReactNode
	onChange?: (value: string | undefined) => void
	onBlur?: () => void // for RHF
	onFocus?: () => void // for RHF
	inputRef?: React.Ref<HTMLInputElement> // for RHF registration
	disabled?: boolean
	className?: string
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
	id?: string // for accessibility
}

function Select({
	variant = 'default',
	options,
	name,
	placeholder = 'Select',
	value,
	defaultValue,
	leftIcon,
	onChange,
	onBlur,
	onFocus,
	inputRef,
	disabled,
	className = '',
	radius = 'md',
	id,
}: SelectProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const optionRefs = useRef<Array<HTMLDivElement | null>>([])

	// controlled / uncontrolled
	const [internal, setInternal] = useState<string | undefined>(defaultValue)
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
	const generatedId = useId()
	const listboxId = generatedId
	const triggerId = id || generatedId

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

	const selectedIndex = options.findIndex(o => o.value === selected)
	const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

	const handleSelect = useCallback(
		(val: string) => {
			const current = controlled ? value : internal
			const next = current === val ? undefined : val
			setInternal(next)
			onChange?.(next)
			setIsOpen(false)
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
				const cur = Math.max(selectedIndex, -1)
				setHighlightedIndex(findNext(bufferRef.current, cur) || 0)
				return
			}
			const base = highlightedIndex >= 0 ? highlightedIndex : -1
			const match = findNext(bufferRef.current, base)
			if (match >= 0) setHighlightedIndex(match)
			return
		}

		if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			setIsOpen(true)
			setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
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
				if (isOpen && highlightedIndex >= 0) handleSelect(options[highlightedIndex].value)
				else setIsOpen(true)
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

	return (
		<div
			ref={rootRef}
			className={styles.select}
			data-disabled={disabled || undefined}
			data-variant={variant}
		>
			{name && (
				<input
					ref={inputRef}
					type="hidden"
					name={name}
					value={selected ?? ''}
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
						if (next) setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
						return next
					})
				}}
			>
				{leftIcon}
				{selectedOption?.label ?? placeholder}
				<span className={styles.iconChevron} data-open={isOpen} />
			</CustomButton>

			{isOpen && (
				<div
					id={listboxId}
					ref={refs.setFloating}
					className={styles.content}
					role="listbox"
					aria-labelledby={triggerId}
					style={floatingStyles}
					{...getFloatingProps()}
				>
					<div className={styles.options}>
						{options.map((o, idx) => {
							const isSelected = idx === selectedIndex
							const isHighlighted = idx === highlightedIndex
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
									onClick={() => handleSelect(o.value)}
								>
									<span className={styles.optionInner}>
										{o.label}
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

function SelectInput<T extends FieldValues>({
	options,
	name,
	label,
	form,
	required = false,
	...selectProps
}: Omit<SelectProps, 'value' | 'onChange' | 'inputRef' | 'onBlur' | 'name'> & {
	label?: string
	form: UseFormReturn<T>
	name: Path<T>
	required?: boolean
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && (
						<FormLabel>
							{label} {required && <span className={styles.required}>*</span>}
						</FormLabel>
					)}
					<FormControl>
						<Select
							options={options}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							inputRef={field.ref}
							data-control="select"
							{...selectProps}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export { Select, SelectInput }
