'use client'

import React, { useState } from 'react'
import { Input } from '@/components/atoms/input/Input'
import ButtonIcon from '../../button/ButtonIcon'
import CreateItem from '../../../organisms/modals/create-item/CreateItem'
import Select from '../select/Select'
import styles from './Location.module.scss'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'

export interface LocationProps {
	value?: string
	placeholder?: string
	className?: string
	inputClassName?: string
	disabled?: boolean
	readOnly?: boolean
	onValueChange?: (value: string) => void
}

/**
 * **Location Input** component with location icon.
 *
 * A specialized input component for location selection with a built-in location icon.
 * Supports custom styling, disabled state, and value change callbacks.
 *
 * Example:
 * ```tsx
 * <Location
 *   placeholder="Add location"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
const Location: React.FC<LocationProps> = ({
	value = '',
	placeholder = 'Add location',
	className,
	inputClassName,
	disabled = false,
	readOnly = false,
	onValueChange,
}) => {
	const [inputValue, setInputValue] = useState(value)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setInputValue(newValue)
		onValueChange?.(newValue)
	}

	const handleClick = () => {
		console.log('Location icon clicked!', { readOnly, disabled, openCreateItem })
		if (readOnly || disabled) {
			return
		}
		setOpenCreateItem(true)
		console.log('Modal should open now')
	}

	const [openCreateItem, setOpenCreateItem] = useState<boolean>(false)
	return (
		<>
			<div className={`${styles.locationContainer} ${className || ''}`} onClick={handleClick}>
				<Input
					type="text"
					data-control="input"
					placeholder={placeholder}
					value={inputValue}
					onChange={handleChange}
					disabled={disabled}
					readOnly={true}
					className={`${styles.input} ${inputClassName || ''}`}
					rightIcon={
						<ButtonIcon icon="/icons/location.svg" variant="text" styleType="solid" size={30} />
					}
				/>
			</div>

			{openCreateItem && (
				<CreateItem
					open={openCreateItem}
					onClose={() => setOpenCreateItem(false)}
					title="Find a Location"
					size="medium"
					showFooter={false}
					primaryButton={{
						label: 'Done',
						onClick: () => {
							setOpenCreateItem(true)
						},
					}}
				>
					<div className={createItemStyle.formContainer}>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Group name:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Privacy:</label>
							<Select
								options={[
									{ value: 'in-person', label: 'In Person' },
									{ value: 'virtual', label: 'Virtual' },
								]}
								placeholder="Choose who can see the group"
								inputClassName={createItemStyle.input}
								size="small"
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Visibility:</label>
							<Select
								options={[
									{ value: 'in-person', label: 'In Person' },
									{ value: 'virtual', label: 'Virtual' },
								]}
								placeholder="Choose who can find the group"
								inputClassName={createItemStyle.input}
								size="small"
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Category:</label>
							<Select
								options={[
									{ value: 'in-person', label: 'In Person' },
									{ value: 'virtual', label: 'Virtual' },
								]}
								placeholder="Choose a category"
								inputClassName={createItemStyle.input}
								size="small"
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Invite People:</label>
							<Select
								options={[
									{ value: 'in-person', label: 'In Person' },
									{ value: 'virtual', label: 'Virtual' },
								]}
								placeholder="Choose people to invite"
								inputClassName={createItemStyle.input}
								size="small"
							/>
						</div>
					</div>
				</CreateItem>
			)}
		</>
	)
}

export default Location
