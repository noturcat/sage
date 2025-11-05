import { useState } from 'react'
import ButtonIcon from '../button/ButtonIcon'
import style from './Textarea.module.scss'

type TextareaProps = {
	extraClass?: string
	onSubmit?: (text: string) => void
	variant: 'small' | 'large'
	disabled?: boolean
	placeholder?: string
}

const Textarea = ({
	onSubmit,
	extraClass,
	variant = 'large',
	disabled = false,
	placeholder,
}: TextareaProps) => {
	const [text, setText] = useState('')

	const handleSubmit = () => {
		if (text.trim() && !disabled) {
			onSubmit?.(text.trim())
			setText('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !disabled) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const clearText = () => {
		setText('')
	}

	return (
		<div className={style.wrapper}>
			<textarea
				placeholder={placeholder || 'Ask anything'}
				value={text}
				onChange={e => setText(e.target.value)}
				onKeyPress={handleKeyPress}
				disabled={disabled}
				className={` ${extraClass ?? ''} ${variant === 'small' ? style.small : style.large} ${text.trim() ? style.hasText : ''}`}
			/>
			<div className={style.buttons}>
				<ButtonIcon
					icon="/icons/close.svg"
					variant="circular"
					styleType="solid"
					size={14}
					extraClass={`${style.close} ${variant === 'small' ? style.small : style.large} ${text.trim() ? style.removeText : ''}`}
					onClick={clearText}
					disabled={disabled}
					tintColor={'var(--black)'}
				/>
				<ButtonIcon
					icon="/icons/submit.svg"
					variant="circular"
					styleType="solid"
					size={22}
					extraClass={`${style.extraClass} ${variant === 'small' ? style.small : style.large} ${text.trim() ? style.buttonHasText : ''}`}
					onClick={handleSubmit}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

export default Textarea
