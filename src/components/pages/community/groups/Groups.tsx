'use client'

import { useState } from 'react'
import ItemGroup from '@/components/molecules/item-group/ItemGroup'
import BentoBox from '@/components/organisms/bento-box/BentoBox'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import NoDataPage from '@/components/organisms/no-data-page/NoDataPage'
import { mockGroupCards } from '@/mocks/dummyData'
import CreateItem from '@/components/organisms/modals/create-item/CreateItem'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'
import { Input } from '@/components/atoms/input/Input'
import Select from '@/components/atoms/modal/select/Select'
import style from './Groups.module.scss'
const groups = [
	{ title: 'All Groups', count: 0 },
	{ title: 'Featured Groups', count: 10 },
	{ title: 'My Created Groups', count: 100 },
	{ title: 'Nearby Groups', count: 10 },
	{ title: 'Unpublished Groups', count: 0 },
]

const categories = [
	{ title: 'General', count: 0 },
	{ title: 'Yoga', count: 10 },
	{ title: 'Regenerative Farming', count: 100 },
	{ title: 'Parenting', count: 100 },
	{ title: 'Float Therapy', count: 100 },
	{ title: 'Animal Care', count: 100 },
]

const Groups = () => {
	const [openCreateItem, setOpenCreateItem] = useState<boolean>(false)

	return (
		<div className={style.wrapper}>
			<div className={style.wrapperLeft}>
				<ButtonPill label="Create Group" onClick={() => setOpenCreateItem(true)} />
				<ItemGroup title="Groups" items={groups} />
				<ItemGroup title="Categories" items={categories} />
			</div>
			<div className={style.wrapperRight}>
				{mockGroupCards.length > 0 ? (
					<BentoBox
						title="All Groups"
						type="group"
						bentoBoxData={mockGroupCards}
						ctaLabel="Join Group"
					/>
				) : (
					<NoDataPage title="Groups" icon="/icons/groups.svg" />
				)}
			</div>
			<CreateItem
				open={openCreateItem}
				onClose={() => setOpenCreateItem(false)}
				title="Create Group"
				size="medium"
				showFooter
				primaryButton={{
					label: 'Create',
					onClick: () => {
						setOpenCreateItem(true)
					},
				}}
			>
				<div className={createItemStyle.formContainer}>
					<div className={createItemStyle.formField}>
						<label className={createItemStyle.formLabel}>Group name:</label>
						<Input
							type="text"
							data-control="input"
							placeholder="ex. Just Holistics"
							className={createItemStyle.input}
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
						<label className={createItemStyle.formLabel}>Invite People:</label>
						<Select
							options={[
								{ value: 'cat1', label: 'Category 1' },
								{ value: 'cat2', label: 'Category 2' },
								{ value: 'cat3', label: 'Category 3' },
							]}
							placeholder="Choose people to invite"
							inputClassName={createItemStyle.input}
							size="small"
							onValueChange={value => console.log('Selected category:', value)}
						/>
					</div>
				</div>
			</CreateItem>
		</div>
	)
}

export default Groups
