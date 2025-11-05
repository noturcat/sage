'use client'

import React, { createContext, useContext, useId, useRef, useState } from 'react'
import {
	useFloating,
	autoUpdate,
	offset as offsetMiddleware,
	flip,
	shift,
	useInteractions,
	useHover,
	useFocus,
	useDismiss,
	useRole,
} from '@floating-ui/react'
import styles from './Tooltip.module.scss'

interface TooltipContextType {
	isOpen: boolean
	setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void
	triggerId: string
	contentId: string
	triggerRef: React.RefObject<HTMLElement>
	contentRef: React.RefObject<HTMLDivElement>
	floatingStyles: React.CSSProperties
	getFloatingProps: () => Record<string, unknown>
	getReferenceProps: () => Record<string, unknown>
	setReference: (node: HTMLElement | null) => void
	setFloating: (node: HTMLDivElement | null) => void
}

const TooltipContext = createContext<TooltipContextType | null>(null)

function useTooltip() {
	const context = useContext(TooltipContext)
	if (!context) {
		throw new Error('Tooltip components must be used within Tooltip')
	}
	return context
}

interface TooltipProviderProps {
	delayDuration?: number
	children: React.ReactNode
}

function TooltipProvider({ delayDuration = 0, children }: TooltipProviderProps) {
	return (
		<div
			data-slot="tooltip-provider"
			style={{ '--tooltip-delay': `${delayDuration}ms` } as React.CSSProperties}
		>
			{children}
		</div>
	)
}

interface TooltipProps {
	children: React.ReactNode
	delayDuration?: number
	placement?:
		| 'top'
		| 'bottom'
		| 'left'
		| 'right'
		| 'top-start'
		| 'top-end'
		| 'bottom-start'
		| 'bottom-end'
		| 'left-start'
		| 'left-end'
		| 'right-start'
		| 'right-end'
	offset?: number
}

function Tooltip({ children, delayDuration = 0, placement = 'bottom', offset = 4 }: TooltipProps) {
	const triggerRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)

	const triggerId = useId()
	const contentId = useId()

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement,
		middleware: [offsetMiddleware(offset), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	const hover = useHover(context, {
		delay: { open: delayDuration, close: 0 },
	})
	const focus = useFocus(context)
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'tooltip' })

	const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])

	React.useEffect(() => {
		if (refs.reference.current) {
			triggerRef.current = refs.reference.current as HTMLElement
		}
		if (refs.floating.current) {
			contentRef.current = refs.floating.current as HTMLDivElement
		}
	}, [refs.reference, refs.floating])

	const contextValue: TooltipContextType = {
		isOpen,
		setIsOpen,
		triggerId,
		contentId,
		triggerRef: triggerRef as React.RefObject<HTMLElement>,
		contentRef: contentRef as React.RefObject<HTMLDivElement>,
		floatingStyles,
		getFloatingProps,
		getReferenceProps,
		setReference: refs.setReference,
		setFloating: refs.setFloating,
	}

	return (
		<TooltipContext.Provider value={contextValue}>
			<div data-slot="tooltip">{children}</div>
		</TooltipContext.Provider>
	)
}

interface TooltipTriggerProps {
	children: React.ReactNode
	asChild?: boolean
}

function TooltipTrigger({ children, asChild = false }: TooltipTriggerProps) {
	const { setReference, getReferenceProps, triggerId } = useTooltip()

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
			ref: setReference,
			id: triggerId,
			...getReferenceProps(),
		})
	}

	return (
		<span
			ref={setReference}
			id={triggerId}
			className={styles.trigger}
			data-slot="tooltip-trigger"
			{...getReferenceProps()}
		>
			{children}
		</span>
	)
}

interface TooltipContentProps {
	children: React.ReactNode
	className?: string
	sideOffset?: number
}

function TooltipContent({ children, className = '', sideOffset = 0 }: TooltipContentProps) {
	const { isOpen, contentId, triggerId, floatingStyles, getFloatingProps, setFloating } =
		useTooltip()

	if (!isOpen) return null

	return (
		<div
			ref={setFloating}
			id={contentId}
			className={`${styles.content} ${className}`.trim()}
			role="tooltip"
			aria-labelledby={triggerId}
			style={
				{
					...floatingStyles,
					'--side-offset': `${sideOffset}px`,
				} as React.CSSProperties
			}
			data-slot="tooltip-content"
			{...getFloatingProps()}
		>
			{children}
		</div>
	)
}

Tooltip.Provider = TooltipProvider
Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent

export default Tooltip
