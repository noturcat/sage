import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { amount, interval, customerEmail } = body as {
			amount?: number
			interval?: 'day' | 'month' | 'year' | 'one-time'
			customerEmail?: string
		}

		if (!amount || amount < 50) {
			return NextResponse.json({ error: 'Amount too small (minimum $0.50)' }, { status: 400 })
		}

		const currency = (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || 'usd').toLowerCase()
		const isRecurring = interval === 'day' || interval === 'month' || interval === 'year'

		let customerId: string | undefined
		const testClockId =
			process.env.NODE_ENV !== 'production' ? process.env.STRIPE_TEST_CLOCK_ID : undefined

		if (isRecurring) {
			const customer = await stripe.customers.create({
				email: customerEmail,
				metadata: {
					donation_type: 'recurring_initial_payment',
					interval: interval,
					amount: amount.toString(),
				},
				...(testClockId ? { test_clock: testClockId } : {}),
			})
			customerId = customer.id
		}

		const params: Stripe.PaymentIntentCreateParams = {
			amount,
			currency,
			customer: customerId,
			automatic_payment_methods: {
				enabled: true,
			},
			setup_future_usage: isRecurring ? 'off_session' : undefined,
			metadata: {
				donation_type: isRecurring ? 'recurring_initial_payment' : 'one_time',
				interval: interval || 'one-time',
			},
		}

		if (customerEmail) {
			params.receipt_email = customerEmail
		}

		const paymentIntent = await stripe.paymentIntents.create(params)

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			customerId,
		})
	} catch (error) {
		console.error('Create payment intent error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
