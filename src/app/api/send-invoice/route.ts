import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2025-09-30.clover',
})

type Body = {
	amount?: number // smallest currency unit (e.g., cents)
	customerId?: string
	customerEmail?: string
	description?: string
	daysUntilDue?: number
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as Body
		const { amount, customerId, customerEmail, description, daysUntilDue } = body

		if (!amount || amount < 50) {
			return NextResponse.json({ error: 'Amount too small (minimum $0.50)' }, { status: 400 })
		}

		let resolvedCustomerId = customerId
		let resolvedEmail = customerEmail

		if (!resolvedCustomerId && !resolvedEmail) {
			return NextResponse.json(
				{ error: 'Provide either customerId or customerEmail' },
				{ status: 400 }
			)
		}

		// Ensure we have a customer ID with an email on file
		if (!resolvedCustomerId) {
			const customer = await stripe.customers.create({
				email: resolvedEmail,
				metadata: { created_via: 'send-invoice-api' },
			})
			resolvedCustomerId = customer.id
			resolvedEmail = customer.email ?? resolvedEmail
		} else if (!resolvedEmail) {
			const customer = await stripe.customers.retrieve(resolvedCustomerId)
			if (typeof customer === 'object' && customer && 'email' in customer) {
				resolvedEmail = (customer as Stripe.Customer).email ?? undefined
			}
		}

		if (!resolvedEmail) {
			return NextResponse.json(
				{ error: 'Customer must have an email to send the invoice' },
				{ status: 400 }
			)
		}

		const currency = (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || 'usd').toLowerCase()

		await stripe.invoiceItems.create({
			customer: resolvedCustomerId!,
			amount,
			currency,
			description: description || 'Invoice',
		})

		const draftInvoice = await stripe.invoices.create({
			customer: resolvedCustomerId!,
			collection_method: 'send_invoice',
			days_until_due: daysUntilDue ?? 7,
		})

		// Finalize invoice (required before sending)
		const finalized = await stripe.invoices.finalizeInvoice(draftInvoice.id)

		// Try to send the invoice email. If Stripe refuses, still return the hosted URL
		let emailSent = false
		let sendError: unknown = null
		try {
			await stripe.invoices.sendInvoice(finalized.id)
			emailSent = true
		} catch (err) {
			// capture and continue so the client can use hostedInvoiceUrl
			sendError = err
		}

		// Retrieve to include latest metadata
		const refreshed = await stripe.invoices.retrieve(finalized.id)

		// Shape error information (safe for client)
		const errorInfo = (() => {
			if (!sendError) return undefined
			if (typeof sendError === 'object' && sendError !== null) {
				const anyErr = sendError as { type?: string; code?: string; message?: string }
				return {
					type: anyErr.type ?? 'stripe_error',
					code: anyErr.code ?? 'send_invoice_failed',
					message: anyErr.message ?? 'Invoice email could not be sent',
				}
			}
			return { type: 'unknown', code: 'send_invoice_failed', message: String(sendError) }
		})()

		return NextResponse.json({
			invoiceId: finalized.id,
			status: refreshed.status,
			hostedInvoiceUrl: refreshed.hosted_invoice_url,
			number: refreshed.number,
			sentAt: (refreshed.status_transitions as { sent_at?: number } | null)?.sent_at ?? null,
			customerEmail: (refreshed.customer_email as string | null) ?? null,
			emailSent,
			...(errorInfo ? { error: errorInfo } : {}),
		})
	} catch (err: unknown) {
		console.error('Send invoice error:', err)
		const message = err instanceof Error ? err.message : 'Internal server error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
