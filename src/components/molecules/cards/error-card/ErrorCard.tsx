'use client'

import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './ErrorCard.module.scss'

interface ErrorCardProps {
	error?: string
}

function ErrorCard({
	error = 'We couldn&apos;t load this data. Please try again.',
}: ErrorCardProps) {
	const router = useRouter()

	const handleBack = () => {
		router.back()
	}

	return (
		<main className={style.container}>
			<CustomButton size="icon" className={style.backButton} radius="full" onClick={handleBack}>
				<span className={style.iconBack} />
			</CustomButton>
			<div className={style.content}>
				<h1>Something went wrong</h1>
				<p className={style.error}>{error}</p>
			</div>
		</main>
	)
}

export default ErrorCard
