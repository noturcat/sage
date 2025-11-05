'use client'

import React, { createContext, useContext, useId, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Dialog.module.scss'

// Context for sharing state between components
interface DialogContextType {
	isOpen: boolean
	setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void
	triggerId: string
	contentId: string
	triggerRef: React.RefObject<HTMLElement>
	contentRef: React.RefObject<HTMLDivElement>
}

const DialogContext = createContext<DialogContextType | null>(null)

function useDialog() {
	const context = useContext(DialogContext)
	if (!context) {
		throw new Error('Dialog components must be used within Dialog')
	}
	return context
}

// Root dialog component
function Dialog({
	children,
	open,
	onOpenChange,
	...props
}: React.PropsWithChildren<{
	open?: boolean
	onOpenChange?: (open: boolean) => void
}>) {
	const triggerRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(open || false)

	const triggerId = useId()
	const contentId = useId()

	// Sync with external open state
	useEffect(() => {
		if (open !== undefined) {
			setIsOpen(open)
		}
	}, [open])

	// Handle open change
	const handleOpenChange = (newOpen: boolean | ((prev: boolean) => boolean)) => {
		const openValue = typeof newOpen === 'function' ? newOpen(isOpen) : newOpen
		setIsOpen(openValue)
		onOpenChange?.(openValue)
	}

	// Prevent body scroll when dialog is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	const contextValue: DialogContextType = {
		isOpen,
		setIsOpen: handleOpenChange,
		triggerId,
		contentId,
		triggerRef: triggerRef as React.RefObject<HTMLElement>,
		contentRef: contentRef as React.RefObject<HTMLDivElement>,
	}

	return (
		<DialogContext.Provider value={contextValue}>
			<div data-slot="dialog" {...props}>
				{children}
			</div>
		</DialogContext.Provider>
	)
}

// Trigger component
function DialogTrigger({
	children,
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
	const { setIsOpen, triggerId, contentId, triggerRef } = useDialog()

	const handleClick = () => {
		setIsOpen(true)
	}

	// Clone the child element to add our props
	if (React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
			ref: (node: HTMLElement | null) => {
				if (node) {
					triggerRef.current = node
				}
			},
			id: triggerId,
			'aria-haspopup': 'dialog',
			'aria-expanded': false,
			'aria-controls': contentId,
			onClick: handleClick,
			className:
				`${(children as React.ReactElement<Record<string, unknown>>).props.className || ''} ${className}`.trim(),
			...props,
		})
	}

	return (
		<button
			ref={(node: HTMLButtonElement | null) => {
				if (node) {
					triggerRef.current = node
				}
			}}
			id={triggerId}
			className={`${styles.trigger} ${className}`.trim()}
			aria-haspopup="dialog"
			aria-expanded={false}
			aria-controls={contentId}
			onClick={handleClick}
			data-slot="dialog-trigger"
			{...props}
		>
			{children}
		</button>
	)
}

// Portal component
function DialogPortal({ children }: React.PropsWithChildren) {
	const { isOpen } = useDialog()

	if (!isOpen) return null

	return createPortal(children, document.body)
}

// Close component
function DialogClose({
	children,
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
	const { setIsOpen } = useDialog()

	const handleClick = () => {
		setIsOpen(false)
	}

	if (React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
			onClick: handleClick,
			className:
				`${(children as React.ReactElement<Record<string, unknown>>).props.className || ''} ${className}`.trim(),
			...props,
		})
	}

	return (
		<button
			className={`${styles.close} ${className}`.trim()}
			onClick={handleClick}
			data-slot="dialog-close"
			{...props}
		>
			{children}
		</button>
	)
}

// Overlay component
function DialogOverlay({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`${styles.overlay} ${className}`.trim()}
			data-slot="dialog-overlay"
			{...props}
		/>
	)
}

// Content component
function DialogContent({
	className = '',
	children,
	showCloseButton = true,
	...props
}: React.PropsWithChildren<{
	className?: string
	showCloseButton?: boolean
}>) {
	const { isOpen, contentId, triggerId, contentRef, setIsOpen } = useDialog()

	if (!isOpen) return null

	return (
		<DialogPortal>
			<DialogOverlay />
			<div
				ref={contentRef}
				id={contentId}
				className={`${styles.content} ${className}`.trim()}
				role="dialog"
				aria-modal="true"
				aria-labelledby={triggerId}
				data-slot="dialog-content"
				{...props}
			>
				{children}
				{showCloseButton && (
					<button
						className={styles.closeButton}
						onClick={() => setIsOpen(false)}
						aria-label="Close dialog"
					>
						<span className={styles.closeIcon} />
					</button>
				)}
			</div>
		</DialogPortal>
	)
}

// Header component
function DialogHeader({
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div className={`${styles.header} ${className}`.trim()} data-slot="dialog-header" {...props} />
	)
}

// Footer component
function DialogFooter({
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div className={`${styles.footer} ${className}`.trim()} data-slot="dialog-footer" {...props} />
	)
}

// Title component
function DialogTitle({
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) {
	return (
		<h2 className={`${styles.title} ${className}`.trim()} data-slot="dialog-title" {...props} />
	)
}

// Description component
function DialogDescription({
	className = '',
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) {
	return (
		<p
			className={`${styles.description} ${className}`.trim()}
			data-slot="dialog-description"
			{...props}
		/>
	)
}

// Attach sub-components
Dialog.Trigger = DialogTrigger
Dialog.Portal = DialogPortal
Dialog.Close = DialogClose
Dialog.Overlay = DialogOverlay
Dialog.Content = DialogContent
Dialog.Header = DialogHeader
Dialog.Footer = DialogFooter
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription

export default Dialog
