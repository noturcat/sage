import { Metadata } from 'next'
import CreateDiscoverPage from '@/components/pages/discover/CreateDiscoverPage'

export const metadata: Metadata = {
	title: 'Create Discover | Just Holistics',
	description: 'Create a new discover for the Just Holistics community.',
}

function CreateDiscover() {
	return (
		<>
			<CreateDiscoverPage />
		</>
	)
}

export default CreateDiscover
