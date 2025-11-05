import type { Metadata } from 'next'
import 'normalize.css/normalize.css'
import '@/styles/globals.scss'
import Providers from '@/providers/Providers'
import AuthUser from '@/components/util/auth-user/AuthUser'

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
	title: {
		default: 'Just Holistics',
		template: '%s | Just Holistics',
	},
	description: 'A Free Speech Platform For The Holistic Community',
	openGraph: {
		title: 'Just Holistics',
		description: 'A Free Speech Platform For The Holistic Community',
		url: '/',
		siteName: 'Just Holistics',
		images: [{ url: '/images/1.jpg', width: 1200, height: 630, alt: 'Just Holistics' }],
		locale: 'en_US',
		type: 'website',
	},
	// manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning data-app="jh">
			<body suppressHydrationWarning>
				<Providers>
					<AuthUser>{children}</AuthUser>
				</Providers>
			</body>
		</html>
	)
}
