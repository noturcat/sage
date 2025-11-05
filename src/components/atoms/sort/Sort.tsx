'use client'

import React from 'react'
import Image from 'next/image'
//styles
import style from './Sort.module.scss'

export type SortItem = {
	key: string
	label: string
	shortcut?: string
	selected?: boolean
	disabled?: boolean
}

export type SortProps = {
	items: (SortItem | 'divider')[]
	onSelect?: (key: string) => void
	align?: 'left' | 'right'
	openOnHover?: boolean
	className?: string
	triggerClassName?: string
	menuClassName?: string
	closeOnSelect?: boolean
	selectedKey?: string
	isWhiteChevron?: boolean
}

const Sort = ({
	items,
	onSelect,
	align = 'right',
	openOnHover = false,
	className,
	triggerClassName,
	menuClassName,
	closeOnSelect = true,
	selectedKey,
	isWhiteChevron = false,
}: SortProps) => {
	const [open, setOpen] = React.useState(false)
	const containerRef = React.useRef<HTMLDivElement | null>(null)
	const [current, setCurrent] = React.useState<string | undefined>(selectedKey)

	const selectedLabel = React.useMemo(() => {
		const isItem = (i: SortItem | 'divider'): i is SortItem => i !== 'divider'
		if (current) {
			const found = items.find((i): i is SortItem => isItem(i) && i.key === current)
			if (found) return found.label
		}
		const firstSelected = items.find((i): i is SortItem => isItem(i) && !!i.selected)
		const firstItem = items.find((i): i is SortItem => isItem(i))
		return firstSelected?.label ?? firstItem?.label ?? ''
	}, [current, items])

	// Keep internal selection in sync with prop changes
	React.useEffect(() => {
		setCurrent(selectedKey)
	}, [selectedKey])

	React.useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const renderTrigger = () => (
		<div
			className={`${style.trigger} ${triggerClassName ?? ''}`}
			data-open={open}
			role="button"
			tabIndex={0}
			aria-haspopup="menu"
			aria-expanded={open}
			onClick={() => setOpen(o => !o)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					setOpen(o => !o)
				}
			}}
		>
			<span>{selectedLabel}</span>
			<i className={isWhiteChevron ? style.whiteChevron : style.chevron} aria-hidden="true" />
		</div>
	)

	return (
		<div
			ref={containerRef}
			className={`${style.dropdown} ${className ?? ''}`}
			{...(openOnHover
				? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
				: {})}
		>
			{renderTrigger()}
			<div
				role="menu"
				className={`${style.menu} ${menuClassName ?? ''} ${open ? style.open : style.hidden}`}
				style={{ right: align === 'right' ? 0 : 'auto', left: align === 'left' ? 0 : 'auto' }}
				onKeyDown={e => {
					if (e.key === 'Escape') setOpen(false)
				}}
			>
				{items.map((item, idx) => {
					if (item === 'divider') return <div key={`d-${idx}`} className={style.divider} />
					const isSelected = current ? current === item.key : !!item.selected
					return (
						<button
							key={item.key}
							className={`${style.item} ${isSelected ? style.selected : ''}`}
							role="menuitemradio"
							aria-checked={isSelected}
							onClick={() => {
								if (item.disabled) return
								onSelect?.(item.key)
								setCurrent(item.key)
								if (closeOnSelect) setOpen(false)
							}}
							disabled={item.disabled}
						>
							<div className={style.itemRow}>
								<div className={style.itemLeft}>
									<span>{item.label}</span>
								</div>
								{isSelected && (
									<Image src="/icons/white-check.svg" alt="selected" width={16} height={16} />
								)}
							</div>
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default Sort
