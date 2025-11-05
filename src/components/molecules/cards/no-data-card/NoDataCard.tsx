'use client'

import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './NoDataCard.module.scss'

interface NoDataCardProps {
	module?: string
}

function NoDataCard({ module = 'Data' }: NoDataCardProps) {
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
				<h1>{module} Not Found</h1>
				<p className={style.description}>
					The {module.toLowerCase()} you&apos;re looking for doesn&apos;t exist or has been removed.
				</p>
			</div>
		</main>
	)
}

export default NoDataCard
