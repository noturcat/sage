'use client'

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import P from "@/components/atoms/typography/paragraph/P";
import Heading from "@/components/atoms/typography/heading/Heading";
import PersonalRegisterForm from "@/components/molecules/forms/registration-form/PersonalRegisterForm";
import SelectAccountType from "@/components/organisms/select-account-type/SelectAccountType";
import style from "@/app/(auth)/layout.module.css"

const SignUp = () => {
	const { push } = useRouter()
	const searchParams = useSearchParams()
	const accountType = searchParams.get('accountType')

	const handleSignUpRoute = (accountType: 'personal' | 'business') => {
		if (accountType === 'business') {
			push('/sign-up?accountType=business')
		} else if (accountType === 'personal') {
			push('/sign-up?accountType=personal')
		} else {
			push('/sign-up')
		}
	}

	const handleRoute = (route: string) => {
		push(route)
	}

	const forms: Record<string, React.ReactNode> = {
		// business: <BusinessRegisterForm />,
		personal: <PersonalRegisterForm />,
	};

	return (
		<div className={style.wrapper}>
			<div className={style.heroSection}>
				<Link href="/">
					<Image src={'/icons/just-holistics-logo.svg'} alt={'Just Holistics Logo'} width={230} height={28} />
				</Link>

				<div className={style.heroContent}>
					<Heading as={'h1'} extraClass={style.title}>
						A Free Speech Platform For The Holistic Community
					</Heading>

					<P as={'p'} extraClass={style.subtitle}>Join the Just Holistics community as a personal or business provider.</P>
				</div>
			</div>
			<div className={style.formWrapper}>
				{accountType ? (
					forms[accountType] || null
				) : (
					<SelectAccountType
						onSelectAccount={handleSignUpRoute}
						onLogin={() => handleRoute("sign-in")}
					/>
				)}
			</div>
		</div>
	);
}

export default SignUp
