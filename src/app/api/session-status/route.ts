import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const sessionId = searchParams.get('session_id')

		if (!sessionId) {
			return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
		}

		// Retrieve the Checkout Session
		const session = await stripe.checkout.sessions.retrieve(sessionId)

		// Retrieve the customer details
		const customer = session.customer
			? await stripe.customers.retrieve(session.customer as string)
			: null

		return NextResponse.json({
			status: session.status,
			payment_status: session.payment_status,
			customer_email:
				customer && typeof customer === 'object' && 'email' in customer ? customer.email : null,
		})
	} catch (err: unknown) {
		console.error(err)
		const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
