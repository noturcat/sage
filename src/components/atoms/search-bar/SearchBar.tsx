'use client'

import React from 'react'
import Image from 'next/image'
import { ImageLoader } from '@/util/imageLoader'
import { useGlobalSearch } from '@/providers/GlobalSearchProvider'
import TextType from '@/components/atoms/text-type/TextType'
import styles from './SearchBar.module.scss'

type SearchBarProps = {
	placeholder?: string
	value?: string
	onChange?: (value: string) => void
	onSubmit?: (value: string) => void
	extraClass?: string
	size?: number
	suggestions: string[]
}

const PLACEHOLDER_MS = 3000

type Phase = 'placeholder' | 'typing'

const SearchBar = ({
	placeholder = 'Search here...',
	value,
	onChange,
	onSubmit,
	extraClass,
	size = 20,
	suggestions = [
		'Functional Medicine',
		'Infrared Sauna',
		'Acupuncture',
		'Upper Cervical Chiropractic',
		'Herbal Medicine',
	],
}: SearchBarProps) => {
	const [internalValue, setInternalValue] = React.useState<string>('')
	const inputValue = value !== undefined ? value : internalValue
	const inputRef = React.useRef<HTMLInputElement | null>(null)

	const { open: openGlobalSearch } = useGlobalSearch()

	const [phase, setPhase] = React.useState<Phase>('placeholder')
	const [restartKey, setRestartKey] = React.useState(0)
	const placeholderTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	React.useEffect(() => {
		if (phase !== 'placeholder') return
		if (placeholderTimerRef.current) clearTimeout(placeholderTimerRef.current)
		placeholderTimerRef.current = setTimeout(() => setPhase('typing'), PLACEHOLDER_MS)
		return () => {
			if (placeholderTimerRef.current) {
				clearTimeout(placeholderTimerRef.current)
				placeholderTimerRef.current = null
			}
		}
	}, [phase])

	const handleChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const next = e.target.value
			if (value === undefined) setInternalValue(next)
			onChange?.(next)
		},
		[onChange, value]
	)

	const handleSubmit = React.useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault()
			onSubmit?.(inputValue)
			openGlobalSearch()
		},
		[onSubmit, inputValue, openGlobalSearch]
	)

	const showGhost = !inputValue && phase === 'typing'

	const handleSentenceComplete = React.useCallback(
		(_sentence: string, index: number) => {
			const lastIndex = suggestions.length - 1
			if (index === lastIndex) {
				setPhase('placeholder')
				if (placeholderTimerRef.current) clearTimeout(placeholderTimerRef.current)
				placeholderTimerRef.current = setTimeout(() => {
					setRestartKey(k => k + 1)
					setPhase('typing')
				}, PLACEHOLDER_MS)
			}
		},
		[suggestions]
	)

	return (
		<div className={styles.center}>
			<form className={`${styles.root} ${extraClass ?? ''}`} onSubmit={handleSubmit} role="search">
				{showGhost && (
					<div className={`${styles.ghostWrapper} ${styles.ghostVisible}`} aria-hidden="true">
						<TextType
							key={restartKey}
							className={styles.ghost}
							text={suggestions}
							typingSpeed={60}
							deletingSpeed={30}
							pauseDuration={1200}
							initialDelay={250}
							showCursor={true}
							hideCursorWhileTyping={false}
							cursorCharacter="|"
							cursorClassName={styles.cursor}
							startOnVisible={true}
							variableSpeed={{ min: 40, max: 110 }}
							textColors={['#000000']}
							loop={true}
							onSentenceComplete={handleSentenceComplete}
						/>
					</div>
				)}

				<input
					ref={inputRef}
					className={styles.input}
					type="search"
					placeholder={phase === 'placeholder' ? placeholder : showGhost ? '' : placeholder}
					value={inputValue}
					onChange={handleChange}
					aria-label="Search"
					autoComplete="off"
					enterKeyHint="search"
					onClick={() => openGlobalSearch()}
					onFocus={() => openGlobalSearch()}
				/>

				{inputValue ? (
					<button
						type="button"
						className={styles.clearButton}
						aria-label="Clear search"
						onClick={() => {
							if (value === undefined) setInternalValue('')
							onChange?.('')
							inputRef.current?.focus()
						}}
					>
						<Image
							className={styles.icon}
							loader={ImageLoader}
							src="/icons/close.svg"
							alt="Close icon"
							width={size}
							height={size}
						/>
					</button>
				) : (
					<button type="submit" className={styles.iconButton} aria-label="Submit search">
						<Image
							className={styles.icon}
							loader={ImageLoader}
							src="/icons/magnifying-glass.svg"
							alt="Search icon"
							width={size}
							height={size}
						/>
					</button>
				)}
			</form>
		</div>
	)
}

export default SearchBar
