import { Metadata } from 'next'
import { Suspense } from 'react'
import OneProtocolPage from '@/components/pages/protocols/OneProtocolPage'

export const metadata: Metadata = {
	title: 'Protocols | Just Holistics',
	description:
		'Discover evidence-based wellness protocols from the Just Holistics community. Find curated health and lifestyle protocols for optimal living.',
}

function Protocol() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OneProtocolPage />
		</Suspense>
	)
}

export default Protocol
