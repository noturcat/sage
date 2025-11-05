import { Metadata } from 'next'
import CreateThreadPage from '@/components/pages/threads/CreateThreadPage'

export const metadata: Metadata = {
	title: 'Create Thread | Just Holistics',
	description: 'Create a new thread for the Just Holistics community.',
}

function CreateThread() {
	return (
		<>
			<CreateThreadPage />
		</>
	)
}

export default CreateThread
