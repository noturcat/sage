'use client'

import React, { createContext, useContext, useCallback, useId, useRef, useState } from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	useInteractions,
	useClick,
	useDismiss,
} from '@floating-ui/react'
import styles from './Popover.module.scss'

// Context for sharing state between components
interface PopoverContextType {
	isOpen: boolean
	setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void
	triggerId: string
	contentId: string
	triggerRef: React.RefObject<HTMLElement>
	contentRef: React.RefObject<HTMLDivElement>
	floatingStyles: React.CSSProperties
	getFloatingProps: () => Record<string, unknown>
	setReference: (node: HTMLElement | null) => void
	setFloating: (node: HTMLDivElement | null) => void
}

const PopoverContext = createContext<PopoverContextType | null>(null)

function usePopover() {
	const context = useContext(PopoverContext)
	if (!context) {
		throw new Error('Popover components must be used within Popover')
	}
	return context
}

// Root popover component
function Popover({ children, ...props }: React.PropsWithChildren) {
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	const triggerId = useId()
	const contentId = useId()

	// Floating UI setup
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [offset(4), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	const click = useClick(context)
	const dismiss = useDismiss(context)

	const { getFloatingProps } = useInteractions([click, dismiss])

	// Update refs to use Floating UI refs
	React.useEffect(() => {
		if (refs.reference.current) {
			triggerRef.current = refs.reference.current as HTMLElement
		}
		if (refs.floating.current) {
			contentRef.current = refs.floating.current as HTMLDivElement
		}
	}, [refs.reference, refs.floating])

	const contextValue: PopoverContextType = {
		isOpen,
		setIsOpen,
		triggerId,
		contentId,
		triggerRef: triggerRef as React.RefObject<HTMLElement>,
		contentRef: contentRef as React.RefObject<HTMLDivElement>,
		floatingStyles,
		getFloatingProps,
		setReference: refs.setReference,
		setFloating: refs.setFloating,
	}

	return (
		<PopoverContext.Provider value={contextValue}>
			<div ref={rootRef} className={styles.popover} data-slot="popover" {...props}>
				{children}
			</div>
		</PopoverContext.Provider>
	)
}

// Trigger component
function PopoverTrigger({
	children,
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
	const { setIsOpen, triggerId, contentId, triggerRef, setReference } = usePopover()

	const handleClick = useCallback(() => {
		setIsOpen(prev => !prev)
	}, [setIsOpen])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
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
			'aria-haspopup': 'dialog',
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
			aria-haspopup="dialog"
			aria-expanded={false}
			aria-controls={contentId}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			data-slot="popover-trigger"
			{...props}
		>
			{children}
		</button>
	)
}

// Content component
function PopoverContent({
	className = '',
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	const {
		isOpen,
		contentId,
		triggerId,
		contentRef,
		floatingStyles,
		getFloatingProps,
		setFloating,
	} = usePopover()

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
			role="dialog"
			aria-labelledby={triggerId}
			data-slot="popover-content"
			style={floatingStyles}
			{...getFloatingProps()}
			{...props}
		>
			{children}
		</div>
	)
}

// Anchor component (simplified - renders in place for this implementation)
function PopoverAnchor({
	children,
	className = '',
	...props
}: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div className={`${styles.anchor} ${className}`.trim()} data-slot="popover-anchor" {...props}>
			{children}
		</div>
	)
}

Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent
Popover.Anchor = PopoverAnchor

export default Popover
