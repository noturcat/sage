'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookie, setCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import { authRepository } from '@/repositories/AuthRepository'
import useUserStore from '@/store/UserStore'
import Heading from '@/components/atoms/typography/heading/Heading'
import TextInput from '@/components/atoms/form/text/TextInput'
import PasswordInput from '@/components/atoms/form/password/PasswordInput'
import CheckboxInput from '@/components/atoms/form/checkbox/CheckboxInput'
import A from '@/components/atoms/link/A'
import SmartForm from '../SmartForm'
import style from './LoginForm.module.scss'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'

interface FormData {
	username: string
	password: string
}

type UserStoreState = ReturnType<typeof useUserStore.getState>

type LoginFormProps = {
	onSuccess?: () => void
}
const LoginForm = ({ onSuccess }: LoginFormProps) => {
	const { push } = useRouter()
	const router = useRouter()
	const [resetTrigger] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false)
	const userState: UserStoreState = useUserStore.getState()
	const setUser = userState.setUser

	const formMethods = useForm<FormData>()

	const onSubmit = async ({ username, password }: FormData) => {
		setLoading(true)
		deleteCookie('userToken')

		const formData = { username, password }

		try {
			const response = await authRepository.login(formData)

			// if (onSuccess && response.status === 200) {
			// 	const { token } = response.json
			// 	setUser(response.user)
			// 	setCookie('userToken', `${token}`, {
			// 		maxAge: 7 * 60 * 60 * 24,
			// 		sameSite: 'lax',
			// 		secure: true,
			// 	})
			// 	onSuccess()
			// }

			if (response.status === 200) {
				const { token } = response.json

				setUser(response.user)
				setCookie('userToken', token, {
					maxAge: 7 * 60 * 60 * 24,
					sameSite: 'lax',
					secure: process.env.NODE_ENV === 'production',
				})

				router.push('/')

				if (onSuccess) {
					onSuccess()
				}
			}

			setLoading(false)
		} catch (error) {
			console.error('Error: ', error)
			setLoading(false)
		}
	}

	const onForgotPassword = () => {
		push('/reset-password')
	}

	const handleRoute = () => {
		push('/sign-up')
	}

	return (
		<SmartForm
			className={style.loginForm}
			onSubmit={onSubmit}
			submitLabel={'Login'}
			loading={loading}
			resetTrigger={resetTrigger}
			methods={formMethods}
			submitButton={'icon'}
		>
			<div className={style.heading}>
				<div className={style.headingTitle}>
					<ButtonIcon
						variant={'text'}
						styleType={'icon'}
						icon={'/icons/back.svg'}
						size={38}
						onClick={handleRoute}
					/>
					<Heading as={'h4'} fontWeight={'semibold'}>Login</Heading>
				</div>
			</div>

			<div className={style.formGroup}>
				<TextInput
					name={'username'}
					label={'Username'}
					placeholder={'Username'}
					rules={{ required: { value: true, message: 'This field is required' } }}
				/>

				<PasswordInput
					name={'password'}
					label={'Password'}
					placeholder={'Password'}
					rules={{ required: { value: true, message: 'This field is required' } }}
				/>

				<CheckboxInput
					name={'remember_me'}
					rules={{ required: false }}
					options={[
						{
							value: 'remember_me',
							label: 'Remember Me',
						},
					]}
				/>

				<div className={`${style.links} ${style.centered}`}>
					<A onClick={onForgotPassword}>Forgot your Password?</A>
				</div>
			</div>
		</SmartForm>
	)
}

export default LoginForm
