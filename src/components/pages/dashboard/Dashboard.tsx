'use client'

//react
import React, { useMemo, useState } from 'react'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import Sort, { SortItem } from '@/components/atoms/sort/Sort'
import CreateItem from '@/components/organisms/modals/create-item/CreateItem'
import CreateAd from '@/components/atoms/create-ad/CreateAd'
import { Input } from '@/components/atoms/input/Input'
import ImageUpload from '@/components/atoms/custom-upload/customUpload'
import { DateAndTime } from '@/components/atoms/date-and-time/DateAndTime'
import CheckoutPage from '@/components/pages/home/donate/checkout-as-guest/CheckoutPage'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// styles
import style from './Dashboard.module.scss'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'

const sortItems: (SortItem | 'divider')[] = [
	{ key: '7', label: 'Last 7 days' },
	{ key: '14', label: 'Last 14 days' },
	{ key: '30', label: 'Last 30 days' },
]

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

const Dashboard = () => {
	const [activeButton, setActiveButton] = useState('Insights')

	const [steps, setSteps] = useState(0)

	// Minimal config for rendering the Payment Element from the dashboard
	const amount = 500
	const interval: 'one-time' | 'day' | 'month' | 'year' = 'one-time'
	const formData = { email: '' }

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

	const [eventData, setEventData] = useState({
		eventName: '',
		eventDate: '',
		endEventDate: '',
		privacy: '',
		venue: '',
		category: '',
		description: '',
		image: null as File | null,
	})

	const handleEventDataChange = (field: string, value: string | File | null | undefined) => {
		setEventData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const goToNextStep = () => {
		setSteps(prev => prev + 1)
	}

	return (
		<div>
			<div className={style.wrapper}>
				<div className={style.content}>
					<div className={style.contentLeft}>
						<span>Professional dashboard</span>
						<div className={style.contentLeftButtons}>
							<ButtonPill
								variant="outlined"
								label="Insights"
								extraClass={`${style.extraClass} ${activeButton === 'Insights' ? style.active : ''}`}
								onClick={() => setActiveButton('Insights')}
							/>
							<ButtonPill
								variant="outlined"
								label="Ad tools"
								extraClass={`${style.extraClass} ${activeButton === 'Ad tools' ? style.active : ''}`}
								onClick={() => setActiveButton('Ad tools')}
							/>
						</div>
					</div>
					<div
						className={
							style.contentRight + ' ' + (activeButton === 'Insights' ? style.bottom : style.center)
						}
					>
						{activeButton === 'Insights' && (
							<div className={style.sortContainer}>
								<Sort items={sortItems} align="right" triggerClassName={style.sort} />
							</div>
						)}
						{activeButton === 'Ad tools' && (
							<ButtonPill
								label="Create ad"
								variant="primary"
								onClick={() => setSteps(1)}
								className={style.createAdButton}
							/>
						)}
					</div>
				</div>
			</div>
			{steps == 1 && (
				<CreateItem open={steps == 1} onClose={() => setSteps(0)} title="Create Ad" size="medium">
					<div className={createItemStyle.adsContainer}>
						<CreateAd
							title="Banner Ad (Image)"
							description="Static visual ad (96x96px only)"
							image="/icons/image.svg"
							onClick={() => {
								setSteps(2)
							}}
						/>
						<CreateAd
							title="Banner for Sage AI"
							description="Specialized slot for AI recommendations"
							image="/icons/sage-ai.svg"
							onClick={() => setSteps(2)}
						/>
					</div>
				</CreateItem>
			)}
			{steps == 2 && (
				<CreateItem
					open={steps == 2}
					onClose={() => setSteps(0)}
					title="New Banner Ad Item"
					size="medium"
					showBackButton
					onBack={() => setSteps(1)}
					showFooter
					primaryButton={{
						label: 'Continue',
						onClick: () => {
							setSteps(3)
						},
					}}
				>
					<div className={createItemStyle.formContainer}>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Name:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics Video"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Display Ad Title:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics Business Listing Ad"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Destination URL:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. www.justholistics.com"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Date:</label>
							<DateAndTime
								dateValue={eventData.eventDate}
								enddateValue={eventData.endEventDate}
								onDateChange={date => handleEventDataChange('eventDate', date)}
								onEndDateChange={date => handleEventDataChange('endEventDate', date)}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Upload Media:</label>
							<ImageUpload
								icon="/icons/image.svg"
								label="Drag and Drop Image / Upload Image"
								span="(jpg/png only)"
								height="162px"
								onImageSelect={file => handleEventDataChange('image', file)}
								onImageRemove={() => handleEventDataChange('image', null)}
								styleType="bordered"
							/>
						</div>
					</div>
				</CreateItem>
			)}
			{steps == 3 && (
				<CreateItem
					open={steps == 3}
					onClose={() => setSteps(0)}
					title="Budget & Payment"
					size="medium"
				>
					<Elements stripe={stripePromise} options={elementsOptions}>
						<CheckoutPage
							amount={amount}
							interval={interval}
							customerEmail={formData.email}
							onPaymentSuccess={goToNextStep}
							processPayment={true}
						/>
					</Elements>
				</CreateItem>
			)}
		</div>
	)
}

export default Dashboard
