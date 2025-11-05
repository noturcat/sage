import { Metadata } from 'next'
import { Suspense } from 'react'
import OneDiscoveryPage from '@/components/pages/discover/OneDiscoveryPage'

export const metadata: Metadata = {
	title: 'Discover | Just Holistics',
	description:
		'Discover evidence-based wellness discoveries from the Just Holistics community. Find curated health and lifestyle discoveries for optimal living.',
}

function Discover() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OneDiscoveryPage />
		</Suspense>
	)
}

export default Discover
