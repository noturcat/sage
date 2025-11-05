'use client'

import React, { forwardRef } from 'react'
import style from './Switch.module.scss'

export interface SwitchProps {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	className?: string
	name?: string
	value?: string
	'aria-label'?: string
	'aria-labelledby'?: string
	'aria-describedby'?: string
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			checked,
			defaultChecked = false,
			onCheckedChange,
			disabled = false,
			className = '',
			name,
			value,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			'aria-describedby': ariaDescribedBy,
			...props
		},
		ref
	) => {
		const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
		const isControlled = checked !== undefined
		const isChecked = isControlled ? checked : internalChecked

		const handleClick = () => {
			if (disabled) return

			const newChecked = !isChecked

			if (!isControlled) {
				setInternalChecked(newChecked)
			}

			onCheckedChange?.(newChecked)
		}

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (disabled) return

			if (event.key === ' ' || event.key === 'Enter') {
				event.preventDefault()
				handleClick()
			}
		}

		const classes = `
      ${style.switch}
      ${isChecked ? style.checked : style.unchecked}
      ${disabled ? style.disabled : ''}
      ${className}
    `.trim()

		return (
			<button
				ref={ref}
				type="button"
				role="switch"
				aria-checked={isChecked}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
				disabled={disabled}
				className={classes}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				data-state={isChecked ? 'checked' : 'unchecked'}
				data-slot="switch"
				{...props}
			>
				<span className={style.thumb} data-slot="switch-thumb" />
				{name && <input type="hidden" name={name} value={value || (isChecked ? 'on' : 'off')} />}
			</button>
		)
	}
)

Switch.displayName = 'Switch'

export { Switch }
export default Switch
