'use client'

import { useState } from 'react'
import { deleteCookie, getCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import { authRepository } from '@/repositories/AuthRepository'
import { LoginType } from '@/types/Auth.type'
import Heading from '@/components/atoms/typography/heading/Heading'
import P from '@/components/atoms/typography/paragraph/P'
import Button from '@/components/atoms/button/Button'
import SmartForm from '../SmartForm'
import style from './ChangeEmailForm.module.scss'
import TextInput from '@/components/atoms/form/text/TextInput'

type FormData = Record<string, never>

const ChangeEmailForm = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [loading, setLoading] = useState<boolean>(false)

	const formMethods = useForm<FormData>()

	const onSubmit = async () => {
		setLoading(true)

		try {
			const username = (getCookie('username') || getCookie('userEmail') || '') as string
			const password = (getCookie('password') || '') as string

			const loginData: LoginType = { username, password }

			const loginResponse = await authRepository.login(loginData)

			if (onSuccess && loginResponse?.status === 200) {
				deleteCookie('userId')
				deleteCookie('username')
				deleteCookie('userEmail')
				deleteCookie('password')
				onSuccess()
			}
		} catch (error) {
			console.error("Error :", error)
		}

		setLoading(false)
	}

	return (
		<SmartForm
			className={style.resetPasswordForm}
			onSubmit={onSubmit}
			submitLabel="Continue"
			loading={loading}
			methods={formMethods}
		>
			<div className={style.formGroup}>
				<div className={style.formContent}>
					<Heading as="h4" fontWeight="bold">Update your email address</Heading>
					<P as="p" extraClass={style.intructions}>It seems you no longer use this email address. Updating it will help keep your account secure.</P>

					<TextInput
						name={'email'}
						placeholder={'Enter your new email'}
						rules={{ required: { value: true, message: 'This field is required' }, minLength: 8, maxLength: 16 }}
					/>

					<div className={style.actions}>
						<Button
							type="submit"
							variant="primary"
							styleType="solid"
							label="Update email address"
							loading={loading}
						/>

						<Button
							type="button"
							variant="primary"
							styleType="outlined"
							label="Not now"
							loading={loading}
						/>
					</div>
				</div>
			</div>
		</SmartForm>
	)
}

export default ChangeEmailForm
