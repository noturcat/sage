'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import { userRepository } from '@/repositories/UserRepository'
import { authRepository } from '@/repositories/AuthRepository'
import TextInput from '@/components/atoms/form/text/TextInput'
import PasswordInput from '@/components/atoms/form/password/PasswordInput'
import RadioInput from '@/components/atoms/form/radio/RadioInput'
import CheckboxInput from '@/components/atoms/form/checkbox/CheckboxInput'
import Heading from '@/components/atoms/typography/heading/Heading'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import A from '@/components/atoms/link/A'
import SmartForm from '../SmartForm'
import style from './PersonalRegisterForm.module.scss'

type PersonalRegisterFormProps = {
  onTermsAndConditions?: () => void
}

interface FormData {
  email: string
  username: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  gender: string
  interest: string
}

const PersonalRegisterForm = ({ onTermsAndConditions }: PersonalRegisterFormProps) => {
	const { push } = useRouter()
  const [resetTrigger] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const formMethods = useForm<FormData>()
  const { setError } = formMethods

  const onSubmit = async ({ email, username, password, password_confirmation, first_name, last_name, gender }: FormData) => {
    setLoading(true)

    const setPasswordsMismatch = () => {
      setError('password_confirmation', { type: 'manual', message: 'Passwords do not match' })
      setError('password', { type: 'manual', message: 'Passwords do not match' })
    }

    try {
      if (password !== password_confirmation) {
        setPasswordsMismatch()
        return
      }

      const availability = await userRepository.checkAvailability({ email, username })
      if (availability?.email_exists) {
        setError('email', { type: 'manual', message: 'Email is already taken' })
        return
      }
      if (availability?.username_exists) {
        setError('username', { type: 'manual', message: 'Username is already taken' })
        return
      }

      const payload = {
        email,
        username,
        first_name,
        last_name,
        password,
        password_confirmation,
        gender,
      }

      const response = await authRepository.register(payload)
			if (response.status === 201) {
        setCookie('userId', response?.json?.id)
        setCookie('email', email)
        setCookie('password', password)
				setLoading(false)
				push('verify-account')
      }
    } catch (error) {
      console.error('Error: ', error)
    } finally {
      setLoading(false)
    }
  }

	const handleRoute = () => {
		push('/sign-up')
	}

  return (
    <SmartForm
      className={style.registerForm}
      onSubmit={onSubmit}
      submitLabel={'Sign Up'}
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
					<Heading as={'h4'} fontWeight={'semibold'}>Sign Up as Personal</Heading>
				</div>
			</div>
      <div className={style.formGroup}>
        <TextInput
          name={'first_name'}
          label={'Name'}
          placeholder={'First Name'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <TextInput
          name={'last_name'}
          placeholder={'Last Name'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <TextInput
          name={'username'}
          label={'Username'}
          placeholder={'Username'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <TextInput
          name={'email'}
          label={'Email'}
          inputType="email"
          placeholder={'user@email.com'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <PasswordInput
          name={'password'}
          label={'Password'}
          placeholder={'Password'}
          rules={{ required: { value: true, message: 'This field is required' }, minLength: 8, maxLength: 16 }}
        />

        <PasswordInput
          name={'password_confirmation'}
          placeholder={'Retype your password'}
          rules={{ required: { value: true, message: 'This field is required' }, minLength: 8, maxLength: 16 }}
        />

        <div className={style.fullWidth}>
          <RadioInput
            name={'gender'}
            label={'Gender'}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'prefer not to say', label: 'Prefer not to say' }
            ]}
          />
        </div>

        <div className={`${style.fullWidth} ${style.centered}`}>
          <CheckboxInput
            name={'terms'}
            rules={{ required: { value: true, message: '' } }}
            options={[
              {
                value: 'terms',
                label: (
                  <>
                    I agree to the&nbsp;
                    <A onClick={onTermsAndConditions}>
                      Terms and Conditions
                    </A>
                  </>
                )
              }
            ]}
          />
        </div>
      </div>
    </SmartForm>
  )
}

export default PersonalRegisterForm
