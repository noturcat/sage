import { useMemo, useState } from 'react'
import { Input } from '@/components/atoms/input/Input'
import CheckoutPage from './CheckoutPage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import LoaderSuccess from '@/components/atoms/loader/LoaderSuccess'
import style from './CheckoutAsGuest.module.scss'

const PRESETS = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 'Other'] // amounts in cents (e.g., 500 = $5.00)

// Initialize Stripe with fallback to prevent errors
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

const CheckoutAsGuest = () => {
	const [amount, setAmount] = useState<number>(typeof PRESETS[0] === 'number' ? PRESETS[0] : 0)
	const [interval, setInterval] = useState<'one-time' | 'day' | 'month' | 'year'>('one-time')
	const [success, setSuccess] = useState(false)
	// Form data state
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		country: '',
		state: '',
		city: '',
		zipCode: '',
		mobileNumber: '',
		taxID: '',
		platformFee: false,
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
	}

	// Handle form field changes
	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	// Validate form data for step 1
	const validateStep1 = () => {
		const requiredFields = [
			'firstName',
			'lastName',
			'username',
			'email',
			'country',
			'state',
			'city',
			'zipCode',
			'mobileNumber',
			'taxID',
		]
		return requiredFields.every(field => {
			const value = formData[field as keyof typeof formData]
			return value && String(value).trim() !== ''
		})
	}

	// Validate step 2 - checkbox must be checked
	const validateStep2 = () => {
		return formData.platformFee === true
	}

	// Navigation functions
	const goToNextStep = () => {
		if (step === 1 && !validateStep1()) {
			alert('Please fill in all required fields before proceeding.')
			return
		}

		if (step === 2 && !validateStep2()) {
			alert('Please check the platform fee checkbox to proceed.')
			return
		}

		if (step < 4) {
			setStep(step + 1)
		}
	}

	const goToPreviousStep = () => {
		if (step > 1) {
			setStep(step - 1)
		}
	}

	async function completeDonation() {
		try {
			// The payment is already processed in step 3, this step just shows the summary
			setSuccess(true)
		} catch (e) {
			alert((e as Error).message)
		}
	}

	const [step, setStep] = useState(1)

	const elementsOptions = useMemo(() => {
		const baseOptions = {
			mode: 'payment' as const,
			amount,
			currency: 'usd',
		}

		if (interval !== 'one-time') {
			return {
				...baseOptions,
				setup_future_usage: 'off_session' as const,
			}
		}

		return baseOptions
	}, [amount, interval])

	return (
		<>
			{success ? (
				<LoaderSuccess />
			) : (
				<div className={style.container}>
					<div className={style.formHeader}>
						{step == 1 && <span>&nbsp;</span>}
						{step > 1 && (
							<ButtonIcon
								icon="/icons/back.svg"
								variant="text"
								styleType="icon"
								size={30}
								onClick={goToPreviousStep}
							/>
						)}
						<label>Make a Donation</label>
						<span>&nbsp;</span>
					</div>
					<div className={style.donationSteps}>
						<button className={step > 0 ? style.active : ''}>
							<div />
							<span>Donor&apos;s Details</span>
						</button>
						<button className={step > 1 ? style.active : ''}>
							<div />
							<span>Donation&apos;s Details</span>
						</button>
						<button className={step > 2 ? style.active : ''}>
							<div />
							<span>Payment Summary</span>
						</button>
						<button className={step > 3 ? style.active : ''}>
							<div />
							<span>Order Summary</span>
						</button>
					</div>
					<div className={style.form} onSubmit={handleSubmit}>
						{step === 1 && (
							<>
								<div className={style.formContainer}>
									<div className={style.formRow}>
										<div className={style.formField}>
											<label className={style.formLabel}>Name:</label>
											<Input
												type="text"
												name="firstName"
												placeholder="First Name"
												value={formData.firstName}
												onChange={e => handleInputChange('firstName', e.target.value)}
												required
											/>
										</div>
										<div className={style.formField}>
											<Input
												type="text"
												name="lastName"
												placeholder="Last Name"
												value={formData.lastName}
												onChange={e => handleInputChange('lastName', e.target.value)}
												required
											/>
										</div>
									</div>
									<div className={style.formRow}>
										<div className={style.formField}>
											<label className={style.formLabel}>Username:</label>
											<Input
												type="text"
												name="username"
												placeholder="Username"
												value={formData.username}
												onChange={e => handleInputChange('username', e.target.value)}
												required
											/>
										</div>
										<div className={style.formField}>
											<label className={style.formLabel}>Email:</label>
											<Input
												type="text"
												name="email"
												placeholder="user@email.com"
												value={formData.email}
												onChange={e => handleInputChange('email', e.target.value)}
												required
											/>
										</div>
									</div>
									<div className={style.formRow}>
										<div className={style.formField}>
											<label className={style.formLabel}>Country:</label>
											<Input
												type="text"
												name="country"
												placeholder="Ex. United States"
												value={formData.country}
												onChange={e => handleInputChange('country', e.target.value)}
												required
											/>
										</div>
										<div className={style.formField}>
											<label className={style.formLabel}>State:</label>
											<Input
												type="text"
												name="state"
												placeholder="Ex. California"
												value={formData.state}
												onChange={e => handleInputChange('state', e.target.value)}
												required
											/>
										</div>
									</div>
									<div className={style.formRow}>
										<div className={style.formField}>
											<label className={style.formLabel}>City:</label>
											<Input
												type="text"
												name="city"
												placeholder="Ex. Los Angeles"
												value={formData.city}
												onChange={e => handleInputChange('city', e.target.value)}
												required
											/>
										</div>
										<div className={style.formField}>
											<label className={style.formLabel}>Zip Code:</label>
											<Input
												type="text"
												name="zipCode"
												placeholder="Ex. 90001"
												value={formData.zipCode}
												onChange={e => handleInputChange('zipCode', e.target.value)}
												required
											/>
										</div>
									</div>
									<div className={style.formRow}>
										<div className={style.formField}>
											<label className={style.formLabel}>Mobile Number:</label>
											<Input
												type="text"
												name="mobileNumber"
												placeholder="Ex. 555-555-1234"
												value={formData.mobileNumber}
												onChange={e => handleInputChange('mobileNumber', e.target.value)}
												required
											/>
										</div>
										<div className={style.formField}>
											<label className={style.formLabel}>Tax ID:</label>
											<Input
												type="text"
												name="taxID"
												placeholder="Ex. XX-XXXXXXX"
												value={formData.taxID}
												onChange={e => handleInputChange('taxID', e.target.value)}
												required
											/>
										</div>
									</div>
								</div>
								<ButtonIcon
									icon="/icons/arrow-right.svg"
									variant="primary"
									styleType="solid"
									label="Next"
									size={16}
									extraClass={style.submitButton}
									onClick={goToNextStep}
									disabled={!validateStep1()}
								/>
							</>
						)}
						{step === 2 && (
							<>
								<div className={style.formContainer}>
									<div className={style.formField}>
										<label className={style.formLabel}>Choose from Options:</label>
										<div className={style.amountButtons}>
											{PRESETS.map(preset => (
												<ButtonPill
													key={typeof preset === 'number' ? preset : 'other'}
													type="button"
													variant={amount === preset ? 'primary' : 'outlined'}
													label={typeof preset === 'number' ? `$${preset / 100}` : preset}
													extraClass={
														style.extraClass + (amount === preset ? ' ' + style.active : '')
													}
													onClick={() =>
														setAmount(typeof preset === 'number' ? preset : (0 as number))
													}
												/>
											))}
										</div>
									</div>
									<div className={style.formField}>
										<label className={style.formLabel}>Donation Options:</label>
										<div className={style.donationOptions}>
											<ButtonPill
												type="button"
												variant={interval === 'one-time' ? 'primary' : 'outlined'}
												label="One Time Giving"
												extraClass={
													style.extraClass + (interval === 'one-time' ? ' ' + style.active : '')
												}
												onClick={() => setInterval('one-time')}
											/>
											<ButtonPill
												type="button"
												variant={interval === 'month' ? 'primary' : 'outlined'}
												label="Monthly Giving"
												extraClass={
													style.extraClass + (interval === 'month' ? ' ' + style.active : '')
												}
												onClick={() => setInterval('month')}
											/>
										</div>
									</div>
									<div className={style.checkboxContainer}>
										<input
											type="checkbox"
											id="platformFee"
											name="platformFee"
											className={style.checkbox}
											checked={formData.platformFee}
											onChange={e => handleInputChange('platformFee', e.target.checked)}
										/>
										<span>
											I wish to donate ${(amount / 100).toFixed(2)} as platform fee. This is
											included in the transaction amount.
										</span>
									</div>
								</div>
								<ButtonIcon
									icon="/icons/arrow-right.svg"
									variant="primary"
									styleType="solid"
									label="Next"
									size={16}
									extraClass={style.submitButton}
									onClick={goToNextStep}
									disabled={!validateStep2()}
								/>
							</>
						)}
						{step === 3 && (
							<>
								<Elements stripe={stripePromise} options={elementsOptions}>
									<CheckoutPage
										amount={amount}
										interval={interval}
										customerEmail={formData.email}
										onPaymentSuccess={goToNextStep}
										processPayment={true}
									/>
								</Elements>
							</>
						)}
						{step === 4 && (
							<>
								<div className={style.formContainer}>
									<div className={style.orderSummary}>
										<h3>Donation Details:</h3>
										<div className={style.orderSummaryContainer}>
											<div className={style.summaryRow}>
												<span>Donation ID:</span>
												<span>{Math.random().toString(36).substring(2, 15)}</span>
											</div>
											<div className={style.summaryRow}>
												<span>Date:</span>
												<span>{new Date().toLocaleDateString()}</span>
											</div>
											<div className={style.summaryRow}>
												<span>Donation Type:</span>
												<span>
													{interval === 'one-time'
														? 'One-time'
														: interval === 'day'
															? 'Daily'
															: interval === 'month'
																? 'Monthly'
																: 'Yearly'}
												</span>
											</div>
											<div className={style.summaryRow}>
												<span>Amount:</span>
												<span>${(amount / 100).toFixed(2)}</span>
											</div>
											<div className={style.summaryRow}>
												<span>Payment Method:</span>
												<span>Stripe</span>
											</div>
										</div>
									</div>
									<div className={style.orderSummary}>
										<h3>Donor Details:</h3>
										<div className={style.orderSummaryContainer}>
											<div className={style.summaryRow}>
												<span>Name:</span>
												<span>
													{formData.firstName} {formData.lastName}
												</span>
											</div>
											<div className={style.summaryRow}>
												<span>City:</span>
												<span>{formData.city}</span>
											</div>
											<div className={style.summaryRow}>
												<span>State:</span>
												<span>{formData.state}</span>
											</div>
											<div className={style.summaryRow}>
												<span>Country:</span>
												<span>{formData.country}</span>
											</div>
											<div className={style.summaryRow}>
												<span>Email Address:</span>
												<span>{formData.email}</span>
											</div>
										</div>
									</div>
									<div className={style.orderSummary}>
										<h3>Payment Status:</h3>
										<div className={style.orderSummaryContainer}>
											<div className={style.summaryRow}>
												<span>Payment Status:</span>
												<span className={style.pending}>Pending</span>
											</div>
										</div>
									</div>
								</div>
								<ButtonIcon
									icon="/icons/arrow-right.svg"
									variant="primary"
									styleType="solid"
									label="Next"
									size={16}
									extraClass={style.submitButton}
									onClick={completeDonation}
								/>
							</>
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default CheckoutAsGuest
