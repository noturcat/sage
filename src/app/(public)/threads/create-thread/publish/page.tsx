import { Metadata } from 'next'
import PublishThreadPage from '@/components/pages/threads/PublishThreadPage'

export const metadata: Metadata = {
	title: 'Publish Thread | Just Holistics',
	description: 'Publish the new thread you created for the Just Holistics community.',
}

function PublishThread() {
	return (
		<>
			<PublishThreadPage />
		</>
	)
}

export default PublishThread
