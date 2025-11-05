'use client'

import { useState } from 'react'
import ItemGroup from '@/components/molecules/item-group/ItemGroup'
import BentoBox from '@/components/organisms/bento-box/BentoBox'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import { categories, events, mockEventCards } from '@/mocks/dummyData'
import NoDataPage from '@/components/organisms/no-data-page/NoDataPage'
import Calendar from '@/components/molecules/calendar/Calendar'
import CreateItem from '@/components/organisms/modals/create-item/CreateItem'
import createItemStyle from '@/components/organisms/modals/create-item/CreateItem.module.scss'
import { Input } from '@/components/atoms/input/Input'
import { Textarea } from '@/components/atoms/form/textarea/Textarea'
import Select from '@/components/atoms/modal/select/Select'
import ImageUpload from '@/components/atoms/custom-upload/customUpload'
import { DateAndTime } from '@/components/atoms/date-and-time/DateAndTime'
import Location from '@/components/atoms/modal/location/Location'
import style from './Events.module.scss'

const Events = () => {
	const today = new Date()
	const markers = [new Date(2025, 0, 10), new Date(2025, 0, 30)]
	const [openCreateItem, setOpenCreateItem] = useState<boolean>(false)

	// Form state for event creation
	const [eventData, setEventData] = useState({
		eventName: '',
		eventDate: '',
		eventTime: '',
		eventTimezone: 'UTC',
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
	return (
		<div className={style.wrapper}>
			<div className={style.wrapperLeft}>
				<ButtonPill label="Create Event" onClick={() => setOpenCreateItem(true)} />
				<ItemGroup title="Events" items={events} />
				<ItemGroup title="Categories" items={categories} />
				<Calendar value={{ from: today, to: today }} markers={markers} />
			</div>
			<div className={style.wrapperRight}>
				{mockEventCards.length > 0 ? (
					<BentoBox
						title="All Events"
						type="event"
						bentoBoxData={mockEventCards}
						ctaLabel="Interested"
					/>
				) : (
					<NoDataPage title="Events" icon="/icons/events.svg" />
				)}
			</div>
			<CreateItem
				open={openCreateItem}
				onClose={() => setOpenCreateItem(false)}
				title="Create Event"
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
						<ImageUpload
							icon="/icons/image.svg"
							label="Add Cover Image"
							height="162px"
							onImageSelect={file => handleEventDataChange('image', file)}
							onImageRemove={() => handleEventDataChange('image', null)}
							row
						/>
					</div>
					<div className={createItemStyle.formField}>
						<label className={createItemStyle.formLabel}>Event name:</label>
						<Input
							type="text"
							data-control="input"
							placeholder="ex. Just Holistics"
							className={createItemStyle.input}
						/>
					</div>
					<div className={createItemStyle.formField}>
						<label className={createItemStyle.formLabel}>Date and Time:</label>
						<DateAndTime
							dateValue={eventData.eventDate}
							timeValue={eventData.eventTime}
							timezoneValue={eventData.eventTimezone}
							onDateChange={date => handleEventDataChange('eventDate', date)}
							onTimeChange={time => handleEventDataChange('eventTime', time)}
							onTimezoneChange={timezone => handleEventDataChange('eventTimezone', timezone)}
						/>
					</div>
					<div className={createItemStyle.formField}>
						<label className={createItemStyle.formLabel}>Privacy:</label>
						<Select
							options={[
								{ value: 'public', label: 'Public' },
								{ value: 'private', label: 'Private' },
							]}
							placeholder="Choose who can see the event"
							inputClassName={createItemStyle.input}
							size="small"
							value={eventData.privacy}
							onValueChange={value => handleEventDataChange('privacy', value)}
						/>
					</div>
					<div className={createItemStyle.formField}>
						<label className={createItemStyle.formLabel}>Venue:</label>
						<Select
							options={[
								{ value: 'in-person', label: 'In Person' },
								{ value: 'virtual', label: 'Virtual' },
							]}
							placeholder="Is it in person or virtual?"
							inputClassName={createItemStyle.input}
							size="small"
							value={eventData.venue}
							onValueChange={value => handleEventDataChange('venue', value)}
						/>
					</div>
					{eventData.venue === 'in-person' && (
						<div className={createItemStyle.formField}>
							<label className={createItemStyle.formLabel}>Location:</label>
							<Location
								placeholder="Add location"
								onValueChange={value => handleEventDataChange('location', value)}
							/>
						</div>
					)}
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
						<label className={createItemStyle.formLabel}>Details :</label>
						<Textarea
							data-control="input"
							placeholder="What are the details?"
							className={createItemStyle.input}
							rows={4}
						/>
					</div>
				</div>
			</CreateItem>
		</div>
	)
}

export default Events
