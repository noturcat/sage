import { Metadata } from 'next'
import PublishProtocolPage from '@/components/pages/protocols/PublishProtocolPage'

export const metadata: Metadata = {
	title: 'Publish Protocol | Just Holistics',
	description: 'Publish the new protocol you created for the Just Holistics community.',
}

function PublishProtocol() {
	return (
		<>
			<PublishProtocolPage />
		</>
	)
}

export default PublishProtocol
