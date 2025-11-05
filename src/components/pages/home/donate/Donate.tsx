'use client'

import { useState } from 'react'
import Image from 'next/image'
import JHLogo from '@/components/atoms/jh-logo/JHLogo'
import RegisterAccount from './register-account/RegisterAccount'
import CheckoutAsGuest from './checkout-as-guest/CheckoutAsGuest'
import style from './Donate.module.scss'

const Donate = () => {
	const [isRegisterAccount, setIsRegisterAccount] = useState(false)
	const [isCheckoutAsGuest, setIsCheckoutAsGuest] = useState(false)
	return (
		<div className={style.wrapper}>
			<div className={style.container}>
				<div className={style.imageContainer}>
					<Image
						src="/images/donate-image.jpg"
						alt="Donate"
						width={500}
						height={500}
						className={style.image}
					/>
					<div className={style.imageOverlay}>
						<label>
							<JHLogo size={21} />
						</label>
						<div className={style.textContainer}>
							<span className={style.textLine}>Support</span>
							<span className={style.textLine}>Our</span>
							<span className={style.textLine}>Work</span>
						</div>
					</div>
				</div>
			</div>
			<div className={style.donation}>
				{!isRegisterAccount && !isCheckoutAsGuest && (
					<>
						<label> Checkout Options</label>
						<div className={style.checkoutOptions}>
							<div className={style.checkoutOptionsItems}>
								<div className={style.formField} onClick={() => setIsRegisterAccount(true)}>
									<h2 className={style.modalTitle}>Register Account</h2>
									<div />
									<p className={style.subtitle}>
										Create an account to save your details for future donations, track your giving
										history, and manage your preferences.
									</p>
								</div>
								<div className={style.formField} onClick={() => setIsCheckoutAsGuest(true)}>
									<h2 className={style.modalTitle}>Checkout as Guest</h2>
									<div />
									<p className={style.subtitle}>
										Donate quickly without creating an account. Simply provide your details and
										complete your donation as a guest.
									</p>
								</div>
							</div>
							<div className={style.checkoutOptionsSignIn}>
								Already a donor? <label>Sign In</label>
							</div>
						</div>
					</>
				)}
				{isRegisterAccount && <RegisterAccount />}
				{isCheckoutAsGuest && <CheckoutAsGuest />}
			</div>
		</div>
	)
}

export default Donate
