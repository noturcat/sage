'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion'
import P from "@/components/atoms/typography/paragraph/P";
import Heading from "@/components/atoms/typography/heading/Heading";
import OTPForm from "@/components/molecules/forms/otp-form/OTPForm";
import WelcomePanel from "@/components/molecules/panel/welcome/WelcomePanel";
import style from "@/app/(auth)/layout.module.css"

const VerifyAccount = () => {
	const [showWelcome, setShowWelcome] = useState<boolean>(false)

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
				{!showWelcome && (
					<OTPForm onSuccess={() => setShowWelcome(true)} />
				)}

				{showWelcome && (
					<motion.div
						key="welcome"
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -30 }}
						transition={{ duration: 0.3 }}
					>
						<WelcomePanel />
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default VerifyAccount
