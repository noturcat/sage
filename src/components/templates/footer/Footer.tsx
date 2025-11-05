'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Container from '@/components/util/container/Container'
// import ButtonAnimated from '@/components/atoms/button/ButtonAnimated'
// import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import Divider from '@/components/atoms/divider/Divider'
import P from '@/components/atoms/typography/paragraph/P'
import Heading from '@/components/atoms/typography/heading/Heading'
import TextInput from '@/components/atoms/form/text/TextInput'
import style from './Footer.module.scss'
import SmartForm from '@/components/molecules/forms/SmartForm'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/atoms/button/Button'
import IconBadge from '@/components/atoms/badge/IconBadge'

type FooterItem = { name: string; path: string }

type FooterProps = {
  company?: FooterItem[]
  help?: FooterItem[]
}

interface FormData {
	email: string
}

const Footer = ({ company = [], help = [] }: FooterProps) => {
	const { push } = useRouter()
	const [resetTrigger] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false)

	const formMethods = useForm<FormData>()
	// const { setError } = formMethods

	const handleRoute = (route: string) => {
		push(route)
	}

	// const onSubmit = async ({ email }: FormData) => {
	const onSubmit = async () => {
		setLoading(true)

		try {
			// const payload = {
			// 	email
			// }

			// const response = await authRepository.register(payload as any)
			// if (response.status === 201) {
			// }
		} catch (error) {
			console.error('Error: ', error)
		} finally {
			setLoading(false)
		}
	}

  return (
    <footer className={style.footer}>
      <Container>
				<div className={style.wrapper}>
					<div className={style.columnOne}>
						<Link href="/" className={style.headerLogo}>
							<Image src={'/icons/just-holistics-logo.svg'} alt={'Just Holistics'} width={250} height={30} />
						</Link>

						<P extraClass={style.description}>
							Just Holistics is a holistic social network and directory on a mission to break down conventional social media barriers, empowering individuals and holistic health practitioners to connect with one another online, share their communal knowledge, and empower one another’s journey toward healing.
						</P>

						<div className={style.socials}>
							<IconBadge icon={'/icons/twitter.svg'} size={28} />
							<IconBadge icon={'/icons/facebook.svg'} size={28} />
							<IconBadge icon={'/icons/instagram.svg'} size={28} />
						</div>
					</div>
					<div className={style.columnTwo}>
						<Heading as={'h6'}>COMPANY</Heading>
						<ul className={style.menuList}>
							{company.map((item) => (
								<li key={item.name} onClick={() => handleRoute(item.path)}>
									{item.name}
								</li>
							))}
						</ul>
					</div>
					<div className={style.columnThree}>
						<Heading as={'h6'}>HELP</Heading>
						<ul className={style.menuList}>
							{help.map((item) => (
								<li key={item.name} onClick={() => handleRoute(item.path)}>
									{item.name}
								</li>
							))}
						</ul>
					</div>
					<div className={style.columnFour}>
						<Heading as={'h6'}>SUBSCRIBE TO NEWSLETTER</Heading>

						<SmartForm
							className={style.subscriptionForm}
							onSubmit={onSubmit}
							submitLabel={'Subscribe'}
							loading={loading}
							resetTrigger={resetTrigger}
							methods={formMethods}
							submitButton={'icon'}
						>
							<TextInput
								inputType='text'
								name={'email'}
								label={''}
								placeholder={'Enter your email'}
							/>
						</SmartForm>

						<div className={style.actions}>
							<Button
								type={'button'}
								variant={'secondary-alt'}
								styleType={'solid'}
								label={'Donate'}
							/>

							<Button
								type={'button'}
								variant={'primary'}
								styleType={'solid'}
								label={'Join Us'}
							/>
						</div>
					</div>
				</div>
				<Divider extraClass={style.opacity} />
				<div className={style.footerRights}>
					© 2025 Just Holistics, All Rights Reserved
				</div>
      </Container>
    </footer>
  )
}

export default Footer
