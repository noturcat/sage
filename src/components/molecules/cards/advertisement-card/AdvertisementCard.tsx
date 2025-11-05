'use client'

import ButtonPill from '@/components/atoms/button/ButtonPill'
import { sageAdvertisement } from '@/mocks/dummyData'
import { useState } from 'react'
import Adbutler from '@/components/atoms/advertisement/Adbutler'
import style from './AdvertisementCard.module.scss'

const AdvertisementCard = () => {
	const [isView, setIsView] = useState(false)

	const hasResults = sageAdvertisement.length > 0
	return (
		<div className={style.wrapper}>
			<div className={style.wrapperHeader}>
				<label>{hasResults ? `${sageAdvertisement.length} JH Resources` : ''}</label>
				<ButtonPill label="Sponsored" variant="primary" />
			</div>
			<div className={`${style.wrapperBody} ${!isView ? style.collapsed : ''}`}>
				{sageAdvertisement.map((ad, index) => (
					<div
						key={index}
						className={style.wrapperBodyItem}
						style={{
							transitionDelay:
								!isView && index >= 3 ? '0s' : index >= 3 ? `${(index - 3) * 0.1}s` : '0s',
						}}
					>
						{/* <Advertisement key={index} advertisement={ad.advertisement} type="sage" /> */}
						<Adbutler type="sageai" />
					</div>
				))}
			</div>
			{sageAdvertisement.length > 3 && (
				<div className={style.wrapperFooter}>
					<ButtonPill
						label={isView ? `Collapse` : `View All`}
						variant="primary"
						onClick={() => setIsView(!isView)}
					/>
				</div>
			)}
		</div>
	)
}

export default AdvertisementCard
