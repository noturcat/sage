'use client'

import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import type { PaymentIntent as StripeJsPaymentIntent } from '@stripe/stripe-js'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './CheckoutAsGuest.module.scss'

const CheckoutPage = ({
	amount,
	interval,
	customerEmail,
	onPaymentSuccess,
	processPayment = false,
}: {
	amount: number
	interval?: 'one-time' | 'day' | 'month' | 'year'
	customerEmail?: string
	onPaymentSuccess?: () => void
	processPayment?: boolean
}) => {
	const stripe = useStripe()
	const elements = useElements()

	const [errorMessage, setErrorMessage] = useState<string>()
	const [clientSecret, setClientSecret] = useState<string>()
	const [loading, setLoading] = useState(false)
	const [paymentIntentId, setPaymentIntentId] = useState<string>()
	const [customerId, setCustomerId] = useState<string>()

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		const initializePaymentIntent = async () => {
			try {
				setErrorMessage(undefined)
				setClientSecret(undefined)
				setPaymentIntentId(undefined)
				setCustomerId(undefined)

				const normalizedInterval = interval ?? 'one-time'

				const payload: Record<string, unknown> = {
					amount,
					interval: normalizedInterval,
				}

				if (customerEmail) {
					payload.customerEmail = customerEmail
				}

				const response = await fetch('/api/create-payment-intent', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
					signal: controller.signal,
				})

				const data = await response.json()

				if (!isMounted) {
					return
				}

				if (!response.ok || data.error) {
					const message = data?.error || 'Failed to initialize payment'
					console.error('Payment creation error:', message)
					setErrorMessage(message)
					return
				}

				if (data.clientSecret) {
					setClientSecret(data.clientSecret)
				}

				if (data.paymentIntentId) {
					setPaymentIntentId(data.paymentIntentId)
				}

				if (data.customerId) {
					setCustomerId(data.customerId)
				}
			} catch (err) {
				if (controller.signal.aborted) {
					return
				}
				console.error(err)
				if (isMounted) {
					setErrorMessage('Failed to initialize payment')
				}
			}
		}

		if (amount >= 50) {
			void initializePaymentIntent()
		}

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [amount, interval, customerEmail])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (!processPayment) {
			onPaymentSuccess?.()
			return
		}

		if (!stripe || !elements || !clientSecret) {
			setErrorMessage('Payment form is not ready. Please refresh and try again.')
			return
		}

		setLoading(true)
		setErrorMessage(undefined)

		const normalizedInterval = interval ?? 'one-time'
		const isRecurring = normalizedInterval !== 'one-time'

		try {
			const { error: submitError } = await elements.submit()

			if (submitError) {
				setErrorMessage(submitError.message)
				return
			}

			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/payment-success`,
				},
				redirect: 'if_required',
			})

			if (error) {
				setErrorMessage(error.message)
				return
			}

			let resolvedPaymentIntent: StripeJsPaymentIntent | null | undefined =
				paymentIntent ?? undefined
			if (!resolvedPaymentIntent) {
				const retrieved = await stripe.retrievePaymentIntent(clientSecret)
				resolvedPaymentIntent = retrieved.paymentIntent ?? undefined
			}

			const finalPaymentIntentId = resolvedPaymentIntent?.id ?? paymentIntentId

			if (!finalPaymentIntentId) {
				setErrorMessage('Unable to locate payment confirmation. Please contact support.')
				return
			}

			if (isRecurring) {
				const subscriptionPayload: Record<string, unknown> = {
					amount,
					interval: normalizedInterval,
					paymentIntentId: finalPaymentIntentId,
				}

				if (customerId) {
					subscriptionPayload.customerId = customerId
				}

				const response = await fetch('/api/create-subscription', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(subscriptionPayload),
				})

				const data = await response.json()

				if (!response.ok || data.error) {
					const message = data?.error || 'Failed to start recurring donation'
					setErrorMessage(message)
					return
				}
			}

			// Manual invoice email sending removed for one-time and initial subscription payments.

			onPaymentSuccess?.()
		} catch (err) {
			console.error(err)
			setErrorMessage('Payment failed. Please try again or use a different card.')
		} finally {
			setLoading(false)
		}
	}

	if (!stripe || !elements || !clientSecret) {
		return (
			<div className={style.loading}>
				<div className={style.loadingCircle} />
				<span>Loading...</span>
			</div>
		)
	}
	return (
		<form className={style.form} onSubmit={handleSubmit}>
			<div className={style.formContainer}>
				<PaymentElement />
				{errorMessage && <div className={style.error}>{errorMessage}</div>}
			</div>
			<ButtonIcon
				type="submit"
				disabled={!stripe || loading}
				icon="/icons/arrow-right.svg"
				variant="primary"
				styleType="solid"
				label={processPayment ? 'Next' : 'Next'}
				size={16}
				extraClass={style.submitButton}
			/>
		</form>
	)
}

export default CheckoutPage
