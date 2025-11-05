import { Metadata } from 'next'
import ProfilePage from '@/components/pages/profile/ProfilePage'

export const metadata: Metadata = {
	title: 'Profile | Just Holistics',
	description: 'Profile page of the Just Holistics community.',
}

function Profile() {
	return (
		<>
			<ProfilePage />
		</>
	)
}

export default Profile
