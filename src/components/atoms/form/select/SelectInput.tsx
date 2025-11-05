'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FieldError, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import style from '../Input.module.scss'

export type SelectInputProps = {
	methods?: UseFormReturn
	name: string
	label?: string
	rules?: RegisterOptions
	options: { value: string; label: string }[]
	defaultValue?: string
	defaultLabel?: string
	onChange?: (value: string) => void
}

const SelectInput = ({
	methods,
	name,
	label,
	rules,
	options,
	defaultValue,
	defaultLabel = 'Select option',
	onChange,
}: SelectInputProps) => {
	const errors = methods?.formState?.errors[name]
	const context = useFormContext()

	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState<string | undefined>(defaultValue)
	const wrapperRef = useRef<HTMLDivElement>(null)

	const { register, setValue } = context

	const handleSelect = (value: string) => {
		setSelected(value)
		context.setValue(name, value, { shouldValidate: true })
		onChange?.(value)
		setIsOpen(false)
	}

	const handleClickOutside = (e: MouseEvent) => {
		if (wrapperRef.current && e.target instanceof Node && !wrapperRef.current.contains(e.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		register(name, rules)
		if (defaultValue) {
			setValue(name, defaultValue)
		}
	}, [register, setValue, name, rules, defaultValue])

	return (
		<div className={`${style.formElement} ${errors ? `${style.hasError}` : ''}`} ref={wrapperRef}>
			{label && (
				<label className={style.label}>
					{label}
					<span className={style.required}>{rules?.required ? ' *' : ''}</span>
				</label>
			)}

			<div className={style.selectContainer}>
				<div
					className={`${style.selectBox} ${isOpen ? `${style.open}` : ''} ${style.input} ${style.select}`}
					tabIndex={0}
					onClick={() => setIsOpen(prev => !prev)}
				>
					<span className={`${style.selected} ${selected ? `${style.hasValue}` : ''}`}>
						{options.find(o => o.value === selected)?.label || defaultLabel}
					</span>
					<span className={style.arrow}></span>
				</div>

				{isOpen && (
					<ul className={style.optionsList}>
						{options.map(option => (
							<li
								key={option.value}
								className={`${style.option} ${selected === option.value ? `${style.selectedOption}` : ''}`}
								onClick={() => handleSelect(option.value)}
							>
								{option.label}
								{selected === option.value && (
									<Image src={'/icons/check.svg'} alt={'Check'} width={20} height={20} />
								)}
							</li>
						))}
					</ul>
				)}
			</div>

			<p className={style.error}>{(errors as FieldError)?.message ?? ''}</p>
		</div>
	)
}

export default SelectInput
