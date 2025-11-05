'use client'

import { categories, mockPageCards, pages } from '@/mocks/dummyData'
import { useState } from 'react'
import CreateItem from '@/components/organisms/modals/create-item/CreateItem'
import { Input } from '@/components/atoms/input/Input'
import Select from '@/components/atoms/modal/select/Select'
import ItemGroup from '@/components/molecules/item-group/ItemGroup'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import BentoBox from '@/components/organisms/bento-box/BentoBox'
import NoDataPage from '@/components/organisms/no-data-page/NoDataPage'
import { RadioGroup } from '@/components/atoms/form/radio/RadioGroup'
import ImageUpload from '@/components/atoms/custom-upload/customUpload'
import style from './Pages.module.scss'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'

const Pages = () => {
	const [openCreateItem, setOpenCreateItem] = useState<boolean>(false)
	const [openViewPage, setOpenViewPage] = useState<boolean>(false)

	return (
		<div className={style.wrapper}>
			<div className={style.wrapperLeft}>
				<ButtonPill label="Create Page" onClick={() => setOpenCreateItem(true)} />
				<ItemGroup title="Pages" items={pages} />
				<ItemGroup title="Categories" items={categories} />
			</div>
			<div className={style.wrapperRight}>
				{mockPageCards.length > 0 ? (
					<BentoBox title="All Pages" type="page" bentoBoxData={mockPageCards} ctaLabel="Like" />
				) : (
					<NoDataPage title="Pages" icon="/icons/flag.svg" />
				)}
			</div>
			{!openViewPage && (
				<CreateItem
					open={openCreateItem}
					onClose={() => setOpenCreateItem(false)}
					title="Create Page"
					size="medium"
					showFooter
					primaryButton={{
						label: 'Next',
						onClick: () => {
							setOpenViewPage(true)
						},
					}}
				>
					<div className={createItemStyle.formContainer}>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Page name:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Category:</label>
							<Select
								options={[
									{ value: 'cat1', label: 'Category 1' },
									{ value: 'cat2', label: 'Category 2' },
									{ value: 'cat3', label: 'Category 3' },
								]}
								placeholder="Choose a category"
								inputClassName={createItemStyle.input}
								size="small"
								onValueChange={value => console.log('Selected category:', value)}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Bio:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Phone number:</label>
							<div className={createItemStyle.selectWrapper}>
								<Select
									options={[
										{ value: 'US', label: '+1' },
										{ value: 'PH', label: '+63' },
										{ value: 'UK', label: '+44' },
										{ value: 'CA', label: '+1' },
										{ value: 'AU', label: '+61' },
									]}
									placeholder="+1"
									inputClassName={createItemStyle.input}
									size="small"
									variant="phoneCountryCode"
									onValueChange={value => console.log('Selected country code:', value)}
								/>
								<Input
									type="text"
									data-control="input"
									placeholder="1234567890"
									className={createItemStyle.input}
								/>
							</div>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Email:</label>
							<div className={createItemStyle.selectWrapper}>
								<Input
									type="text"
									data-control="input"
									placeholder="City/Town"
									className={createItemStyle.input}
								/>
								<Input
									type="text"
									data-control="input"
									placeholder="State/Region"
									className={createItemStyle.input}
								/>
								<Input
									type="text"
									data-control="input"
									placeholder="Zip Code"
									className={createItemStyle.input}
								/>
							</div>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Available Hours:</label>
							<div className={createItemStyle.selectWrapper}>
								<RadioGroup
									options={[
										{ value: 'cat1', label: 'No Hours Available' },
										{ value: 'cat2', label: 'Always Open' },
										{ value: 'cat3', label: 'Open at Selected Hours' },
									]}
									align="horizontal"
									required
									className={createItemStyle.radioGroup}
								/>
							</div>
						</div>
					</div>
				</CreateItem>
			)}
			{openViewPage && (
				<CreateItem
					open={openCreateItem}
					onClose={() => setOpenCreateItem(false)}
					title="Create Page"
					size="medium"
					showFooter
					showBackButton={true}
					onBack={() => setOpenViewPage(false)}
					primaryButton={{
						label: 'Create',
						onClick: () => {
							setOpenViewPage(true)
						},
					}}
				>
					<div className={createItemStyle.formContainer}>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Customization:</label>
							<div className={createItemStyle.imageUploadContainer}>
								<ImageUpload
									icon="/icons/image.svg"
									label="Add Profile Picture"
									column
									height="162px"
								/>
								<ImageUpload icon="/icons/image.svg" label="Add Cover Image" row height="162px" />
							</div>
						</div>
					</div>
				</CreateItem>
			)}
		</div>
	)
}

export default Pages
