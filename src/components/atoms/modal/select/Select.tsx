'use client'

import React, { useState } from 'react'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import { Input } from '@/components/atoms/input/Input'
import styles from './Select.module.scss'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'

export interface SelectOption {
	value: string
	label: string
	disabled?: boolean
}

export interface SelectProps {
	options: SelectOption[]
	value?: string
	placeholder?: string
	className?: string
	inputClassName?: string
	disabled?: boolean
	size?: 'small' | 'medium' | 'large' | 'mobile'
	variant?: 'default' | 'phoneCountryCode'
	onValueChange?: (value: string) => void
	onOpenChange?: (open: boolean) => void
}

/**
 * **Reusable Select** component with dropdown functionality.
 *
 * Combines Input and DropdownMenu to create a select-like interface.
 * Supports custom styling, disabled state, and value change callbacks.
 *
 * Example:
 * ```tsx
 * <Select
 *   options={[
 *     { value: 'cat1', label: 'Category 1' },
 *     { value: 'cat2', label: 'Category 2' }
 *   ]}
 *   placeholder="Choose a category"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
const Select: React.FC<SelectProps> = ({
	options,
	value,
	placeholder = 'Select an option',
	className,
	inputClassName,
	disabled = false,
	size = 'medium',
	variant = 'default',
	onValueChange,
}) => {
	const [selectedValue, setSelectedValue] = useState(value || '')

	const selectedOption = options.find(option => option.value === selectedValue)
	const displayValue = selectedOption ? selectedOption.label : ''

	const handleValueChange = (newValue: string) => {
		setSelectedValue(newValue)
		onValueChange?.(newValue)
	}

	return (
		<div
			className={`${styles.selectContainer} ${styles[`size-${size}`]} ${variant === 'phoneCountryCode' ? styles.phoneCountryCode : ''} ${className || ''}`}
		>
			<DropdownMenu>
				<DropdownMenu.Trigger>
					<div className={styles.triggerWrapper}>
						<Input
							type="text"
							data-control="input"
							placeholder={placeholder}
							value={displayValue}
							readOnly
							disabled={disabled}
							className={`${styles.input} ${inputClassName || ''}`}
						/>
						<div className={styles.chevron}>
							<ButtonIcon
								icon="/icons/chevron-down.svg"
								variant="text"
								styleType="solid"
								tintColor={`var(--jh-gray-01)`}
							/>
						</div>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content className={styles.content}>
					{options.map(option => (
						<DropdownMenu.Item
							key={option.value}
							disabled={option.disabled}
							onClick={() => handleValueChange(option.value)}
							className={styles.item}
						>
							<span className={styles.itemText}>{option.label}</span>
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	)
}

export default Select
