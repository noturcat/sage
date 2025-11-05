import 'normalize.css/normalize.css'
import '@/styles/globals.scss'
import { Metadata } from 'next'
import Footer from '@/components/templates/footer/Footer'
import { menuRepository } from '@/repositories/MenuRepository'
import { HeaderType } from '@/types/Menu.type'
import DynamicLayout from '@/components/templates/dynamic-layout/DynamicLayout'
import Header from '@/components/templates/header/Header'

export const metadata: Metadata = {
	title: 'Just Holistics',
	description: 'A Free Speech Platform For The Holistic Community',
}

export const dynamic = 'force-static'
export const revalidate = 3600

export default async function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	let companyLinks: { name: string; path: string }[] = []
	let helpLinks: { name: string; path: string }[] = []

	try {
		const companyRes = await menuRepository.paginate({ type: 'footer-company', perPage: 100 })
		const companyItems: HeaderType[] = companyRes?.data || []
		companyLinks = companyItems.map(({ attributes }) => ({
			name: attributes.name,
			path: attributes.path,
		}))

		const helpRes = await menuRepository.paginate({ type: 'footer-help', perPage: 100 })
		const helpItems: HeaderType[] = helpRes?.data || []
		helpLinks = helpItems.map(({ attributes }) => ({
			name: attributes.name,
			path: attributes.path,
		}))
	} catch {}

	return (
		// <main className={style.wrapper} data-layout="wrapper">
		// 	<NavigationGroup leftNav={leftNavItems} />
		// 	{/* <div className={style.header}>
		// 		<Header initialHeaders={initialHeaders} />
		// 	</div> */}
		// 	<div className={style.content}>{children}</div>
		// 	<div className={style.footer}>
		// 		<Footer company={companyLinks} help={helpLinks} />
		// 	</div>
		// </main>

		<>
			<DynamicLayout
				header={<Header />}
				footer={<Footer company={companyLinks} help={helpLinks} />}
			>
				{children}
			</DynamicLayout>
		</>
	)
}
