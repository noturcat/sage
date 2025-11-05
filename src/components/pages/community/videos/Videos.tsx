'use client'

import { useState } from 'react'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import { categories, videos } from '@/mocks/dummyData'
import ItemGroup from '@/components/molecules/item-group/ItemGroup'
import VideoView from '@/components/organisms/video-view/VideoView'
import CreateItem from '@/components/organisms/modals/create-item/CreateItem'
import { RadioGroup } from '@/components/atoms/form/radio/RadioGroup'
import { Input } from '@/components/atoms/input/Input'
import Select from '@/components/atoms/modal/select/Select'
import CustomUpload from '@/components/atoms/custom-upload/customUpload'
import style from './Videos.module.scss'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'
const Videos = () => {
	const [openCreateItem, setOpenCreateItem] = useState<boolean>(false)
	const [openViewPage, setOpenViewPage] = useState<string>('home')

	return (
		<div className={style.wrapper}>
			<div className={style.wrapperLeft}>
				<ButtonPill label="Upload Video" onClick={() => setOpenCreateItem(true)} />
				<ItemGroup title="Videos" items={videos} />
				<ItemGroup title="Categories" items={categories} />
			</div>
			<div className={style.wrapperRight}>
				<div className={style.wrapperRightExplore}>
					<VideoView title="Explore Videos" view="window" filter />
				</div>
				<div className={style.wrapperRightHolos}>
					<VideoView title="Holos" view="scrollable" filter={false} />
				</div>
				<div className={style.wrapperRightExplore}>
					<VideoView title="Explore Videos" view="window" filter={false} />
				</div>
			</div>
			{openViewPage === 'home' && (
				<CreateItem
					open={openCreateItem}
					onClose={() => setOpenCreateItem(false)}
					title="Select Video Type"
					size="medium"
					showFooter
					subtitle="select the type of video you want to upload"
				>
					<div className={createItemStyle.formContainer}>
						<div className={style.formField} onClick={() => setOpenViewPage('regular')}>
							<h2 className={createItemStyle.modalTitle + ' ' + style.modalTitle}>Regular Video</h2>
							<div />
							<p className={createItemStyle.subtitle}>
								For regular users to explore and use the platform for personal needs.
							</p>
						</div>
						<div className={style.formField}>
							<h2 className={createItemStyle.modalTitle + ' ' + style.modalTitle}>Holos</h2>
							<div />
							<p className={createItemStyle.subtitle}>
								For regular users to explore and use the platform for personal needs.
							</p>
						</div>
					</div>
				</CreateItem>
			)}
			{openViewPage === 'regular' && (
				<CreateItem
					open={openCreateItem}
					onClose={() => setOpenCreateItem(false)}
					title="Upload a Video"
					size="medium"
					primaryButton={{
						label: 'Upload',
						onClick: () => {
							setOpenCreateItem(true)
						},
					}}
					showFooter
					showBackButton
					onBack={() => setOpenViewPage('home')}
				>
					<div className={createItemStyle.formContainer}>
						<div className={createItemStyle.formField}>
							<CustomUpload
								icon="/icons/videos.svg"
								label="Upload Video"
								row
								height="162px"
								uploadType="video"
								maxSize={100}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Title:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. Just Holistics Video"
								className={createItemStyle.input}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Description:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="ex. This videos if for entertaiment purpose only"
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
							<label className={createItemStyle.formLabel}>Privacy:</label>
							<Select
								options={[
									{ value: 'cat1', label: 'Category 1' },
									{ value: 'cat2', label: 'Category 2' },
									{ value: 'cat3', label: 'Category 3' },
								]}
								placeholder="Choose who can see the group"
								inputClassName={createItemStyle.input}
								size="small"
								onValueChange={value => console.log('Selected category:', value)}
							/>
						</div>
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Business Address:</label>
							<Input
								type="text"
								data-control="input"
								placeholder="Business Address"
								className={createItemStyle.input}
							/>
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
		</div>
	)
}

export default Videos
