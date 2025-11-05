import { Metadata } from 'next'
import CreateProtocolPage from '@/components/pages/protocols/CreateProtocolPage'

export const metadata: Metadata = {
	title: 'Create Protocol | Just Holistics',
	description: 'Create a new protocol for the Just Holistics community.',
}

function CreateProtocol() {
	return (
		<>
			<CreateProtocolPage />
		</>
	)
}

export default CreateProtocol
