import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

// Body: { customerId: string }
export async function POST(req: Request) {
	try {
		const { customerId, sessionId } = await req.json()

		let customer = customerId

		// If sessionId is provided, retrieve the customer from the session
		if (!customer && sessionId) {
			const session = await stripe.checkout.sessions.retrieve(sessionId)
			customer = session.customer as string
		}

		if (!customer) {
			return NextResponse.json({ error: 'Customer ID or Session ID required' }, { status: 400 })
		}

		// Create a portal session for the customer to manage their subscription
		const portalSession = await stripe.billingPortal.sessions.create({
			customer,
			return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/donate`,
		})

		return NextResponse.json({
			url: portalSession.url,
		})
	} catch (err: unknown) {
		console.error('Customer portal error:', err)
		const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
