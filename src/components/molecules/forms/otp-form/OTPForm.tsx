'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCookie, setCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import useUserStore, { UserStoreState } from '@/store/UserStore'
import { authRepository } from '@/repositories/AuthRepository'
import Heading from '@/components/atoms/typography/heading/Heading'
import P from '@/components/atoms/typography/paragraph/P'
import TextInput from '@/components/atoms/form/text/TextInput'
import Button from '@/components/atoms/button/Button'
import SmartForm from '../SmartForm'
import style from './OTPForm.module.scss'

interface FormData {
  code: string
}

const OTPForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const countdownStart = 120
  const [resetTrigger] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingResendButton, setLoadingResendButton] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(countdownStart)
  const [disabled, setDisabled] = useState<boolean>(true)
	const userState: UserStoreState = useUserStore.getState()
	const setUser = userState.setUser

  const formMethods = useForm<FormData>()

  const {
    setError
  } = formMethods

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const onResendCode = async () => {
    setLoadingResendButton(true)

    try {
			const userIdCookie = (getCookie('userId')) as string
      if (!userIdCookie) {
        setLoadingResendButton(false)
        return
      }

			const response = await authRepository.resendOtp({ userId: userIdCookie })

      if (response?.status === 201) {
        setLoadingResendButton(false)
        setDisabled(true)
        setCountdown(countdownStart)
      }
    } catch (error) {
      console.error("Error :", error)
    }

    setLoadingResendButton(false)
  }

  const onSubmit = async ({ code }: FormData) => {
    setLoading(true)

    try {
			const userIdCookie = (getCookie('userId')) as string
			if (!userIdCookie) {
        setError('code', { type: 'manual', message: 'Missing user for verification' })
        setLoading(false)
        return
      }

      const response = await authRepository.verifyOtp({ code, userId: userIdCookie })

			if (onSuccess && response?.status === 201) {
				const { token } = response.json
				setUser(response.user)
				setCookie('userToken', `${token}`, { maxAge: 7 * 60 * 60 * 24, sameSite: 'lax', secure: true })
				onSuccess()
      } else {
        setError('code', {
          type: 'manual',
          message: 'OTP code is invalid',
        })
      }
    } catch (error) {
      console.error("Error :", error)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setDisabled(false)
    }
  }, [countdown])

  return (
    <SmartForm
      className={style.otpForm}
      onSubmit={onSubmit}
      submitLabel={'Continue'}
      loading={loading}
      resetTrigger={resetTrigger}
      methods={formMethods}
    >
      <div className={style.formGroup}>
        <div className={style.icon}></div>
        <Heading as={'h4'} fontWeight={'bold'}>Enter OTP</Heading>
        <P as={'p'} extraClass={style.instructions}>Enter the 6-digit verification code sent to your email.</P>
        <TextInput
          name={'code'}
          placeholder={'Enter code*'}
          rules={{ required: { value: true, message: 'This field is required' } }}
        />

        <div className={style.actions}>
          <Button
            variant={'secondary-alt'}
            styleType={'solid'}
            label={disabled ? `Resend Code (${formatTime(countdown)})` : 'Resend Code'}
            disabled={disabled}
            loading={loadingResendButton}
            onClick={onResendCode}
          />

          <Button
            type={'submit'}
            variant={'primary'}
            styleType={'solid'}
            label={'Continue'}
            loading={loading}
          />
        </div>

        <div className={style.contact}>
          <P as={'p'}>
            Trouble receiving the code? <Link href={'#'}>Contact support</Link>
          </P>
        </div>
      </div>
    </SmartForm>
  )
}

export default OTPForm
