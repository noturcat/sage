'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { authRepository } from '@/repositories/AuthRepository'
import Heading from '@/components/atoms/typography/heading/Heading'
import TextInput from '@/components/atoms/form/text/TextInput'
import Button from '@/components/atoms/button/Button'
import SmartForm from '../SmartForm'
import style from './ForgotPasswordForm.module.scss'

interface FormData {
  email: string
}

const ForgotPasswordForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [resetTrigger] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const formMethods = useForm<FormData>()

  const { setError } = formMethods

  const onSubmit = async ({ email }: FormData) => {
    setLoading(true)

    try {
      const response = await authRepository.forgotPassword(email)

      if (onSuccess && response?.status === 201) {
        onSuccess()
      } else {
        setError('email', {
          type: 'manual',
          message: 'Email address is not invalid',
        })
      }
    } catch (error) {
      console.error("Error :", error)
    }

    setLoading(false)
  }

  return (
    <SmartForm
      className={style.forgotPasswordForm}
      onSubmit={onSubmit}
      submitLabel={'Continue'}
      loading={loading}
      resetTrigger={resetTrigger}
      methods={formMethods}
    >
      <div className={style.formGroup}>
        <div className={style.icon}></div>
        <Heading as={'h4'} fontWeight={'bold'}>Forgot Password</Heading>
        <TextInput
          name={'email'}
          placeholder={'Enter email address*'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <div className={style.actions}>
          <Button
            type={'submit'}
            variant={'primary'}
            styleType={'solid'}
            label={'Send reset password link'}
            loading={loading}
          />
        </div>
      </div>
    </SmartForm>
  )
}

export default ForgotPasswordForm
