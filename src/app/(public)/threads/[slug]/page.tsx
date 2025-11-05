import { Metadata } from 'next'
import { Suspense } from 'react'
import OneThreadPage from '@/components/pages/threads/OneThreadPage'

export const metadata: Metadata = {
	title: 'Threads | Just Holistics',
	description:
		'Discover evidence-based wellness threads from the Just Holistics community. Find curated health and lifestyle threads for optimal living.',
}

function Thread() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OneThreadPage />
		</Suspense>
	)
}

export default Thread
