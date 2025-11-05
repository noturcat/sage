import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

// Body: { amount: number (in the smallest currency unit), interval: 'month'|'year' }
export async function POST(req: Request) {
	try {
		const { amount, interval } = await req.json()

		if (!amount || amount < 50) {
			return NextResponse.json({ error: 'Amount too small (minimum $0.50)' }, { status: 400 })
		}

		if (!interval || (interval !== 'month' && interval !== 'year')) {
			return NextResponse.json(
				{ error: 'Invalid interval. Must be "month" or "year"' },
				{ status: 400 }
			)
		}

		const currency = (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || 'usd').toLowerCase()

		// Create a customer first
		const customer = await stripe.customers.create({
			metadata: {
				donation_type: 'recurring',
			},
		})

		// Create a Price for this recurring donation amount
		const price = await stripe.prices.create({
			unit_amount: amount,
			currency,
			recurring: {
				interval: interval as 'month' | 'year',
			},
			product_data: {
				name: `${interval === 'month' ? 'Monthly' : 'Yearly'} Donation`,
			},
		})

		// Create a subscription with incomplete status to get client_secret
		const subscription = await stripe.subscriptions.create({
			customer: customer.id,
			items: [
				{
					price: price.id,
				},
			],
			collection_method: 'charge_automatically',
			payment_behavior: 'default_incomplete',
			payment_settings: {
				payment_method_types: ['card'],
				save_default_payment_method: 'on_subscription',
			},
			expand: ['latest_invoice.payment_intent'],
			metadata: {
				donation_type: 'recurring',
				interval: interval,
				amount: amount.toString(),
			},
		})

		// Get the invoice - it might be an ID or an object
		let invoice: Stripe.Invoice
		if (typeof subscription.latest_invoice === 'string') {
			// If it's a string ID, retrieve the full invoice object
			invoice = await stripe.invoices.retrieve(subscription.latest_invoice, {
				expand: ['payment_intent'],
			})
		} else {
			invoice = subscription.latest_invoice as Stripe.Invoice
		}

		// payment intent
		let invoiceWithPI = invoice as Stripe.Invoice & {
			payment_intent: string | Stripe.PaymentIntent | null
		}

		if (!invoiceWithPI.payment_intent) {
			console.log('Payment intent missing after initial creation; refreshing subscription...')
			const refreshedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
				expand: ['latest_invoice.payment_intent'],
			})

			if (typeof refreshedSubscription.latest_invoice === 'string') {
				invoice = await stripe.invoices.retrieve(refreshedSubscription.latest_invoice, {
					expand: ['payment_intent'],
				})
			} else if (refreshedSubscription.latest_invoice) {
				invoice = refreshedSubscription.latest_invoice as Stripe.Invoice
			}

			invoiceWithPI = invoice as Stripe.Invoice & {
				payment_intent: string | Stripe.PaymentIntent | null
			}
		}

		if (!invoiceWithPI.payment_intent) {
			console.error(
				'Stripe subscription invoice has no payment intent even after refresh',
				JSON.stringify(
					{
						invoiceId: invoice.id,
						invoiceStatus: invoice.status,
						collectionMethod: invoice.collection_method,
						subscriptionId: subscription.id,
					},
					null,
					2
				)
			)
			throw new Error('No payment intent found on invoice')
		}

		// Get the payment intent object
		const paymentIntentIdOrObject = invoiceWithPI.payment_intent
		let paymentIntent: Stripe.PaymentIntent
		if (typeof paymentIntentIdOrObject === 'string') {
			paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentIdOrObject)
		} else {
			paymentIntent = paymentIntentIdOrObject as Stripe.PaymentIntent
		}

		if (!paymentIntent.client_secret) {
			throw new Error('No client secret found on payment intent')
		}

		return NextResponse.json({
			subscriptionId: subscription.id,
			clientSecret: paymentIntent.client_secret,
		})
	} catch (err: unknown) {
		console.error('Checkout session error:', err)
		const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
