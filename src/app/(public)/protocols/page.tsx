import { Metadata } from 'next'
import { Suspense } from 'react'
import ProtocolPage from '@/components/pages/protocols/ProtocolPage'

export const metadata: Metadata = {
	title: 'Protocols | Just Holistics',
	description:
		'Discover evidence-based wellness protocols from the Just Holistics community. Find curated health and lifestyle protocols for optimal living.',
}

function Protocols() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProtocolPage />
		</Suspense>
	)
}

export default Protocols
