'use client'

import Link from "next/link";
import Image from "next/image";
import P from "@/components/atoms/typography/paragraph/P";
import Heading from "@/components/atoms/typography/heading/Heading";
import LoginForm from "@/components/molecules/forms/login-form/LoginForm";
import style from "@/app/(auth)/layout.module.css"

const SignIn = () => {
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
				<LoginForm />
			</div>
		</div>
	);
}

export default SignIn
