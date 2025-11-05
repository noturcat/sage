import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

export async function POST(req: Request) {
	try {
		const { amount, interval, customerId, paymentIntentId } = await req.json()

		if (!amount || amount < 50) {
			return NextResponse.json({ error: 'Amount too small (minimum $0.50)' }, { status: 400 })
		}

		if (!interval || (interval !== 'day' && interval !== 'month' && interval !== 'year')) {
			return NextResponse.json(
				{ error: 'Invalid interval. Must be "day", "month", or "year"' },
				{ status: 400 }
			)
		}

		if (!paymentIntentId) {
			return NextResponse.json({ error: 'Missing payment intent reference' }, { status: 400 })
		}

		const currency = (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || 'usd').toLowerCase()

		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

		if (paymentIntent.status !== 'succeeded') {
			return NextResponse.json(
				{ error: 'Payment must be completed before starting a subscription' },
				{ status: 400 }
			)
		}

		const paymentMethodId =
			typeof paymentIntent.payment_method === 'string'
				? paymentIntent.payment_method
				: paymentIntent.payment_method?.id

		if (!paymentMethodId) {
			return NextResponse.json(
				{ error: 'No payment method found for this payment intent' },
				{ status: 400 }
			)
		}

		let resolvedCustomerId = customerId
		if (!resolvedCustomerId) {
			resolvedCustomerId =
				typeof paymentIntent.customer === 'string' ? paymentIntent.customer : undefined
		}

		if (!resolvedCustomerId) {
			const customer = await stripe.customers.create({
				metadata: {
					donation_type: 'recurring_subscription',
				},
			})
			resolvedCustomerId = customer.id
		}

		try {
			await stripe.paymentMethods.attach(paymentMethodId, {
				customer: resolvedCustomerId,
			})
		} catch (err) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'code' in err &&
				(err as { code?: string }).code === 'resource_already_exists'
			) {
				// Payment method is already attached; safe to ignore
			} else {
				throw err
			}
		}

		await stripe.customers.update(resolvedCustomerId, {
			invoice_settings: {
				default_payment_method: paymentMethodId,
			},
		})

		const price = await stripe.prices.create({
			unit_amount: amount,
			currency,
			recurring: {
				interval,
			},
			product_data: {
				name: `${interval === 'day' ? 'Daily' : interval === 'month' ? 'Monthly' : 'Yearly'} Donation`,
			},
		})

		const trialPeriodDays = interval === 'day' ? 1 : interval === 'month' ? 30 : 365

		const subscription = (await stripe.subscriptions.create({
			customer: resolvedCustomerId,
			items: [
				{
					price: price.id,
				},
			],
			collection_method: 'charge_automatically',
			trial_period_days: trialPeriodDays,
			default_payment_method: paymentMethodId,
			metadata: {
				donation_type: 'recurring',
				interval,
				amount: amount.toString(),
				initial_payment_intent: paymentIntentId,
			},
		})) as Stripe.Subscription

		const nextBillingDate =
			(subscription as Stripe.Subscription & { current_period_end?: number })[
				'current_period_end'
			] ?? null

		return NextResponse.json({
			subscriptionId: subscription.id,
			status: subscription.status,
			nextBillingDate,
		})
	} catch (err: unknown) {
		console.error('Create subscription error:', err)
		const message = err instanceof Error ? err.message : 'Internal server error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
