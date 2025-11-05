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
import style from './RemoveEmailForm.module.scss'

type FormData = Record<string, never>

const RemoveEmailForm = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const formMethods = useForm<FormData>()

	const email = (getCookie('email') || getCookie('userEmail') || '') as string

  const onSubmit = async () => {
    setLoading(true)

    try {
      const password = (getCookie('password') || '') as string
			const loginData: LoginType = { email, password }

      const loginResponse = await authRepository.login(loginData)

      if (loginResponse?.status === 200) {
        deleteCookie('userId')
				deleteCookie('email')
        deleteCookie('userEmail')
        deleteCookie('password')
      }
    } catch (error) {
      console.error("Error :", error)
    }

    setLoading(false)
  }

  return (
    <SmartForm
      className={style.removeEmailForm}
      onSubmit={onSubmit}
      submitLabel="Continue"
      loading={loading}
      methods={formMethods}
    >
      <div className={style.formGroup}>
        <div className={style.formContent}>
          <Heading as="h4" fontWeight="bold">Remove email?</Heading>
					<P as="p" extraClass={style.intructions}>You are about to remove {email} from your account. Please review and confirm this action before continuing.</P>

          <Button
            type="submit"
            variant="primary"
            styleType="solid"
            label="Remove email"
            loading={loading}
          />
        </div>
      </div>
    </SmartForm>
  )
}

export default RemoveEmailForm
