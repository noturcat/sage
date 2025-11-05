'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import Heading from '@/components/atoms/typography/heading/Heading'
import P from '@/components/atoms/typography/paragraph/P'
import Button from '@/components/atoms/button/Button'
import SmartForm from '@/components/molecules/forms/SmartForm'
import style from './LoaderSuccess.module.scss'

type FormData = Record<string, never>

const LoaderSuccess = () => {
	const { push } = useRouter()
	const [loading, setLoading] = useState<boolean>(false)
	const [showCheck, setShowCheck] = useState<boolean>(false)
	const [checkAnimated, setCheckAnimated] = useState<boolean>(false)
	const [revealContent, setRevealContent] = useState<boolean>(false)

	const formMethods = useForm<FormData>()

	const onSubmit = async () => {
		setLoading(true)

		try {
			deleteCookie('userId')
			deleteCookie('username')
			deleteCookie('userEmail')
			deleteCookie('password')
			push('/')
		} catch (error) {
			console.error('Error :', error)
		}

		setLoading(false)
	}

	useEffect(() => {
		const timer1 = setTimeout(() => {
			setShowCheck(true)
			setCheckAnimated(true)
		}, 800)

		const timer2 = setTimeout(() => {
			setRevealContent(true)
		}, 1400)

		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
		}
	}, [])

	return (
		<SmartForm
			className={style.welcomeForm}
			onSubmit={onSubmit}
			submitLabel="Continue"
			loading={loading}
			methods={formMethods}
		>
			<div className={style.formGroup}>
				<div className={`${style.icon} ${style.animateIcon}`}>
					<span
						className={
							showCheck ? `${style.check} ${checkAnimated ? style.animateCheck : ''}` : style.loader
						}
					></span>
				</div>

				<div className={`${style.formContent} ${revealContent ? style.reveal : ''}`}>
					<Heading as="h4" fontWeight="bold">
						Thank you for your support!
					</Heading>
					<P as="p" extraClass={style.welcomeMessage}>
						Every cent of your donation will be used to improve the community.
					</P>

					<div className={style.actions}>
						<Button
							type="button"
							variant="primary"
							styleType="solid"
							label="Done"
							loading={loading}
							onClick={() => (window.location.href = '/donate')}
						/>
					</div>
				</div>
			</div>
		</SmartForm>
	)
}

export default LoaderSuccess
