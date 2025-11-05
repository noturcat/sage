'use client'

import React from 'react'
import style from './ButtonPill.module.scss'

type ButtonPillProps = {
	label: string
	activeLabel?: string
	onClick?: () => void
	disabled?: boolean
	extraClass?: string
	className?: string
	type?: 'button' | 'submit' | 'reset'
	variant?: 'primary' | 'secondary' | 'outlined' | 'ghost'
	toggleable?: boolean
}

const ButtonPill = ({
	label,
	activeLabel,
	onClick,
	disabled = false,
	extraClass,
	className,
	type = 'button',
	variant = 'primary',
	toggleable = false,
}: ButtonPillProps) => {
	const [isActive, setIsActive] = React.useState(false)

	const classes = `
    ${style.buttonPill}
    ${disabled ? style.disabled : ''} 
    ${variant === 'secondary' ? style.secondary : ''}
    ${variant === 'outlined' ? style.outlined : ''} 
    ${variant === 'ghost' ? style.ghost : ''}
	${isActive ? style.active : ''}
	${extraClass ?? ''} ${className ?? ''}

`

	return (
		<button
			type={type}
			className={classes}
			onClick={
				disabled
					? undefined
					: () => {
							if (toggleable) setIsActive(prev => !prev)
							onClick?.()
						}
			}
			disabled={disabled}
		>
			{isActive && activeLabel ? activeLabel : label}
		</button>
	)
}

export default ButtonPill
