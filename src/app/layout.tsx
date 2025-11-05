import type { Metadata } from 'next'
import '@/styles/globals.scss'

export const metadata: Metadata = {
	title: 'Sage AI',
	description: 'Minimal Sage AI demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	)
}
