'use client'

import React, { useCallback, useId, useRef, useState } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import useOutsidePointerDown from '@/components/atoms/form/select/hooks/useOutsidePointerDown'
import useSmartPositioning from '@/components/atoms/form/select/hooks/useSmartPositioning'
import styles from './Menu.module.scss'

/**
 * **Custom accessible menu** with flexible trigger support.
 *
 * Supports custom triggers (text, badge, button, icon) with dropdown functionality
 * for single-layer menu items. Defaults to a button with "Menu" label.
 *
 * Example:
 * ```tsx
 * <Menu
 *   trigger={<CustomButton>Custom Trigger</CustomButton>}
 *   items={[
 *     { label: 'Settings', onClick: () => console.log('Settings') },
 *     { label: 'Privacy', onClick: () => console.log('Privacy') },
 *     { separator: true },
 *     { label: 'Logout', onClick: () => console.log('Logout') }
 *   ]}
 * />
 * ```
 *
 * Notes:
 * - Full keyboard navigation (arrows, enter/space, escape).
 * - Smart dropdown positioning with collision detection.
 * - ARIA compliance for screen readers.
 * - Optimized with React.memo and useId for better performance.
 * - Single-layer menu items only (no nested submenus).
 */

type MenuItem = {
	label: React.ReactNode
	onClick?: () => void
	disabled?: boolean
	separator?: boolean
}

type MenuProps = {
	trigger?: React.ReactNode
	items: MenuItem[]
	variant?: 'default' | 'compact'
	className?: string
	radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

function Menu({ trigger, items, variant = 'default', className = '', radius = 'md' }: MenuProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)

	// Generate unique IDs for accessibility
	const contentId = useId()
	const triggerId = useId()

	// behaviors
	useOutsidePointerDown(isOpen, rootRef, () => setIsOpen(false))
	useSmartPositioning(isOpen, triggerRef, contentRef)

	const handleItemClick = useCallback((item: MenuItem) => {
		if (item.disabled) return

		// Always execute onClick and close menu
		item.onClick?.()
		setIsOpen(false)
	}, [])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault()
					if (!isOpen) {
						setIsOpen(true)
						setHighlightedIndex(0)
					} else {
						setHighlightedIndex(prev => (prev + 1) % items.length)
					}
					break
				case 'ArrowUp':
					e.preventDefault()
					if (!isOpen) {
						setIsOpen(true)
						setHighlightedIndex(items.length - 1)
					} else {
						setHighlightedIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1))
					}
					break
				case 'Enter':
				case ' ':
					e.preventDefault()
					if (isOpen && highlightedIndex >= 0) {
						handleItemClick(items[highlightedIndex])
					} else {
						setIsOpen(true)
					}
					break
				case 'Escape':
					setIsOpen(false)
					setHighlightedIndex(-1)
					break
			}
		},
		[isOpen, highlightedIndex, items, handleItemClick]
	)

	// Default trigger if none provided
	const defaultTrigger = (
		<CustomButton variant="secondary" radius={radius} className={styles.defaultTrigger}>
			Menu
			<span className={styles.iconChevron} data-open={isOpen} />
		</CustomButton>
	)

	// Clone the trigger element to add our props
	const triggerElement = trigger
		? React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
				ref: triggerRef,
				id: triggerId,
				onClick: (e: React.MouseEvent) => {
					// Call original onClick if it exists
					const originalOnClick = (trigger as React.ReactElement<Record<string, unknown>>).props
						.onClick as ((e: React.MouseEvent) => void) | undefined
					if (originalOnClick) {
						originalOnClick(e)
					}
					setIsOpen(prev => !prev)
				},
				onKeyDown: handleKeyDown,
				'aria-haspopup': 'menu',
				'aria-expanded': isOpen,
				'aria-controls': contentId,
			})
		: React.cloneElement(defaultTrigger, {
				ref: triggerRef,
				id: triggerId,
				onClick: () => setIsOpen(prev => !prev),
				onKeyDown: handleKeyDown,
				'aria-haspopup': 'menu',
				'aria-expanded': isOpen,
				'aria-controls': contentId,
			})

	return (
		<div
			ref={rootRef}
			className={`${styles.menu} ${styles[variant]} ${className}`}
			role="menu-dropdown"
		>
			{triggerElement}

			{isOpen && (
				<div
					ref={contentRef}
					id={contentId}
					className={styles.content}
					role="menu"
					aria-labelledby={triggerId}
				>
					<div className={styles.items}>
						{items.map((item, index) => {
							if (item.separator) {
								return <div key={index} className={styles.separator} />
							}

							const isHighlighted = index === highlightedIndex
							return (
								<div
									key={index}
									role="menuitem"
									className={`${styles.item} ${
										isHighlighted ? styles.highlighted : ''
									} ${item.disabled ? styles.disabled : ''}`}
									onMouseDown={e => {
										e.preventDefault()
										handleItemClick(item)
									}}
									onMouseEnter={() => setHighlightedIndex(index)}
									onKeyDown={handleKeyDown}
								>
									{item.label}
								</div>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

export default React.memo(Menu)
