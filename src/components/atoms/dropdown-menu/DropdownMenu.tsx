'use client'

import React, { createContext, useContext, useCallback, useId, useRef, useState } from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useInteractions,
	useDismiss,
} from '@floating-ui/react'
import styles from './DropdownMenu.module.scss'

// Context for sharing state between components
interface DropdownMenuContextType {
	isOpen: boolean
	setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void
	triggerId: string
	contentId: string
	triggerRef: React.RefObject<HTMLElement>
	contentRef: React.RefObject<HTMLDivElement>
	highlightedIndex: number
	setHighlightedIndex: (index: number) => void
	floatingStyles: React.CSSProperties
	getFloatingProps: () => Record<string, unknown>
	setReference: (node: HTMLElement | null) => void
	setFloating: (node: HTMLDivElement | null) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null)

function useDropdownMenu() {
	const context = useContext(DropdownMenuContext)
	if (!context) {
		throw new Error('Dropdown menu components must be used within DropdownMenu')
	}
	return context
}

// Root dropdown menu component
function DropdownMenu({ children, ...props }: React.PropsWithChildren) {
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)

	const triggerId = useId()
	const contentId = useId()

	// Floating UI setup
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(4), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	// Use Floating UI only for positioning, handle interactions manually
	const dismiss = useDismiss(context, {
		// Don't dismiss on escape key (we handle it ourselves)
		escapeKey: false,
	})

	const { getFloatingProps } = useInteractions([dismiss])

	// Update refs to use Floating UI refs
	React.useEffect(() => {
		if (refs.reference.current) {
			triggerRef.current = refs.reference.current as HTMLElement
		}
		if (refs.floating.current) {
			contentRef.current = refs.floating.current as HTMLDivElement
		}
	}, [refs.reference, refs.floating])

	const contextValue: DropdownMenuContextType = {
		isOpen,
		setIsOpen,
		triggerId,
		contentId,
		triggerRef: triggerRef as React.RefObject<HTMLElement>,
		contentRef: contentRef as React.RefObject<HTMLDivElement>,
		highlightedIndex,
		setHighlightedIndex,
		floatingStyles,
		getFloatingProps,
		setReference: refs.setReference,
		setFloating: refs.setFloating,
	}

	return (
		<DropdownMenuContext.Provider value={contextValue}>
			<div ref={rootRef} className={styles.dropdownMenu} data-slot="dropdown-menu" {...props}>
				{children}
			</div>
		</DropdownMenuContext.Provider>
	)
}

// Portal component (simplified - renders in place for this implementation)
function DropdownMenuPortal({ children, ...props }: React.PropsWithChildren) {
	return (
		<div data-slot="dropdown-menu-portal" {...props}>
			{children}
		</div>
	)
}

// Trigger component
function DropdownMenuTrigger({
	children,
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
	const { setIsOpen, triggerId, contentId, triggerRef, setReference } = useDropdownMenu()

	const handleClick = useCallback(() => {
		setIsOpen(prev => !prev)
	}, [setIsOpen])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowDown':
				case 'Enter':
				case ' ':
					e.preventDefault()
					setIsOpen(true)
					break
				case 'Escape':
					setIsOpen(false)
					break
			}
		},
		[setIsOpen]
	)

	// Clone the child element to add our props
	if (React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
			ref: (node: HTMLElement | null) => {
				// Set both the old ref and the new Floating UI ref
				if (typeof triggerRef === 'object' && triggerRef !== null) {
					;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
				}
				setReference(node)
			},
			id: triggerId,
			'aria-haspopup': 'menu',
			'aria-expanded': false,
			'aria-controls': contentId,
			onClick: handleClick,
			onKeyDown: handleKeyDown,
			className:
				`${(children as React.ReactElement<Record<string, unknown>>).props.className || ''} ${className}`.trim(),
			...props,
		})
	}

	return (
		<button
			ref={(node: HTMLButtonElement | null) => {
				// Set both the old ref and the new Floating UI ref
				if (typeof triggerRef === 'object' && triggerRef !== null) {
					;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
				}
				setReference(node)
			}}
			id={triggerId}
			className={`${styles.trigger} ${className}`.trim()}
			aria-haspopup="menu"
			aria-expanded={false}
			aria-controls={contentId}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			data-slot="dropdown-menu-trigger"
			{...props}
		>
			{children}
		</button>
	)
}

// Content component
function DropdownMenuContent({
	className = '',
	// sideOffset = 4,
	children,
	...props
}: React.PropsWithChildren<{
	className?: string
	sideOffset?: number
}>) {
	const {
		isOpen,
		contentId,
		triggerId,
		contentRef,
		floatingStyles,
		getFloatingProps,
		setFloating,
	} = useDropdownMenu()

	if (!isOpen) return null

	return (
		<div
			ref={(node: HTMLDivElement | null) => {
				// Set both the old ref and the new Floating UI ref
				if (typeof contentRef === 'object' && contentRef !== null) {
					;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
				}
				setFloating(node)
			}}
			id={contentId}
			className={`${styles.content} ${className}`.trim()}
			role="menu"
			aria-labelledby={triggerId}
			data-slot="dropdown-menu-content"
			style={floatingStyles}
			{...getFloatingProps()}
			{...props}
		>
			{children}
		</div>
	)
}

// Group component
function DropdownMenuGroup({
	children,
	className = '',
	...props
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div
			className={`${styles.group} ${className}`.trim()}
			data-slot="dropdown-menu-group"
			role="group"
			{...props}
		>
			{children}
		</div>
	)
}

// Menu item component
function DropdownMenuItem({
	className = '',
	inset,
	variant = 'default',
	children,
	onClick,
	disabled,
	...props
}: React.PropsWithChildren<{
	className?: string
	inset?: boolean
	variant?: 'default' | 'destructive'
	onClick?: () => void
	disabled?: boolean
}>) {
	const { setIsOpen } = useDropdownMenu()

	const handleClick = useCallback(() => {
		if (!disabled && onClick) {
			onClick()
			setIsOpen(false)
		}
	}, [onClick, disabled, setIsOpen])

	const itemClasses = [
		styles.item,
		variant === 'destructive' ? styles.destructive : '',
		inset ? styles.inset : '',
		disabled ? styles.disabled : '',
		className,
	]
		.filter(Boolean)
		.join(' ')

	return (
		<div
			className={itemClasses}
			role="menuitem"
			onClick={handleClick}
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			{...props}
		>
			{children}
		</div>
	)
}

// Checkbox item component
function DropdownMenuCheckboxItem({
	className = '',
	children,
	checked,
	onCheckedChange,
	...props
}: React.PropsWithChildren<{
	className?: string
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}>) {
	const { setIsOpen } = useDropdownMenu()

	const handleClick = useCallback(() => {
		if (onCheckedChange) {
			onCheckedChange(!checked)
		}
		setIsOpen(false)
	}, [checked, onCheckedChange, setIsOpen])

	return (
		<div
			className={`${styles.checkboxItem} ${className}`.trim()}
			role="menuitemcheckbox"
			aria-checked={checked}
			onClick={handleClick}
			data-slot="dropdown-menu-checkbox-item"
			{...props}
		>
			<span className={styles.itemIndicator}>
				{checked && <span className={styles.checkIcon} />}
			</span>
			{children}
		</div>
	)
}

// Radio group component
function DropdownMenuRadioGroup({
	children,
	value,
	onValueChange,
	className = '',
	...props
}: React.PropsWithChildren<{
	value?: string
	onValueChange?: (value: string) => void
	className?: string
}>) {
	return (
		<div
			className={`${styles.radioGroup} ${className}`.trim()}
			role="radiogroup"
			data-slot="dropdown-menu-radio-group"
			{...props}
		>
			{React.Children.map(children, child =>
				React.isValidElement(child)
					? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
							groupValue: value,
							onGroupValueChange: onValueChange,
						})
					: child
			)}
		</div>
	)
}

// Radio item component
function DropdownMenuRadioItem({
	className = '',
	children,
	value,
	groupValue,
	onGroupValueChange,
	...props
}: React.PropsWithChildren<{
	className?: string
	value: string
	groupValue?: string
	onGroupValueChange?: (value: string) => void
}>) {
	const { setIsOpen } = useDropdownMenu()
	const isSelected = groupValue === value

	const handleClick = useCallback(() => {
		if (onGroupValueChange) {
			onGroupValueChange(value)
		}
		setIsOpen(false)
	}, [value, onGroupValueChange, setIsOpen])

	return (
		<div
			className={`${styles.radioItem} ${className}`.trim()}
			role="menuitemradio"
			aria-checked={isSelected}
			onClick={handleClick}
			data-slot="dropdown-menu-radio-item"
			{...props}
		>
			<span className={styles.itemIndicator}>
				{isSelected && <span className={styles.radioIcon} />}
			</span>
			{children}
		</div>
	)
}

// Label component
function DropdownMenuLabel({
	className = '',
	inset,
	children,
	...props
}: React.PropsWithChildren<{
	className?: string
	inset?: boolean
}>) {
	const labelClasses = [styles.label, inset ? styles.inset : '', className]
		.filter(Boolean)
		.join(' ')

	return (
		<div className={labelClasses} data-slot="dropdown-menu-label" data-inset={inset} {...props}>
			{children}
		</div>
	)
}

// Separator component
function DropdownMenuSeparator({ className = '', ...props }: { className?: string }) {
	return (
		<div
			className={`${styles.separator} ${className}`.trim()}
			role="separator"
			data-slot="dropdown-menu-separator"
			{...props}
		/>
	)
}

// Shortcut component
function DropdownMenuShortcut({
	className = '',
	children,
	...props
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<span
			className={`${styles.shortcut} ${className}`.trim()}
			data-slot="dropdown-menu-shortcut"
			{...props}
		>
			{children}
		</span>
	)
}

// Sub menu components (simplified implementation)
function DropdownMenuSub({
	children,
	className = '',
	...props
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div className={`${styles.sub} ${className}`.trim()} data-slot="dropdown-menu-sub" {...props}>
			{children}
		</div>
	)
}

function DropdownMenuSubTrigger({
	className = '',
	inset,
	children,
	...props
}: React.PropsWithChildren<{
	className?: string
	inset?: boolean
}>) {
	const triggerClasses = [styles.subTrigger, inset ? styles.inset : '', className]
		.filter(Boolean)
		.join(' ')

	return (
		<div
			className={triggerClasses}
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			{...props}
		>
			{children}
			<span className={styles.chevronRight} />
		</div>
	)
}

function DropdownMenuSubContent({
	className = '',
	children,
	...props
}: React.PropsWithChildren<{
	className?: string
}>) {
	return (
		<div
			className={`${styles.subContent} ${className}`.trim()}
			data-slot="dropdown-menu-sub-content"
			{...props}
		>
			{children}
		</div>
	)
}

DropdownMenu.Portal = DropdownMenuPortal
DropdownMenu.Trigger = DropdownMenuTrigger
DropdownMenu.Content = DropdownMenuContent
DropdownMenu.Group = DropdownMenuGroup
DropdownMenu.Label = DropdownMenuLabel
DropdownMenu.Item = DropdownMenuItem
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem
DropdownMenu.RadioGroup = DropdownMenuRadioGroup
DropdownMenu.RadioItem = DropdownMenuRadioItem
DropdownMenu.Separator = DropdownMenuSeparator
DropdownMenu.Shortcut = DropdownMenuShortcut
DropdownMenu.Sub = DropdownMenuSub
DropdownMenu.SubTrigger = DropdownMenuSubTrigger
DropdownMenu.SubContent = DropdownMenuSubContent

export default DropdownMenu
