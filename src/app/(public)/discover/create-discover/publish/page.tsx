import { Metadata } from 'next'
import PublishDiscoverPage from '@/components/pages/discover/PublishDiscoverPage'

export const metadata: Metadata = {
	title: 'Publish Protocol | Just Holistics',
	description: 'Publish the new protocol you created for the Just Holistics community.',
}

function PublishDiscover() {
	return (
		<>
			<PublishDiscoverPage />
		</>
	)
}

export default PublishDiscover
