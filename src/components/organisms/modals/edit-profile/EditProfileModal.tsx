'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditProfileSchema, editProfileSchema } from '@/components/pages/profile/editProfile.schema'
import { Form } from '@/components/atoms/form/Form'
import Dialog from '@/components/atoms/dialog/Dialog'
import EditProfileAvatar from '@/components/molecules/item-group/EditProfileAvatar'
import EditProfileForm from '@/components/pages/profile/EditProfileForm'
import CustomButton from '@/components/atoms/button/CustomButton'

import style from './EditProfileModal.module.scss'

function EditProfileModal() {
	const [open, setOpen] = useState(false)

	const form = useForm<EditProfileSchema>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			bio: '',
			username: '',
			address: '',
			website: '',
			birthday: '',
			interests: [],
		},
	})

	const onSubmit = (data: EditProfileSchema) => {
		console.log(data)
		setOpen(false) // Close dialog after successful submission
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<CustomButton variant="outline" radius="full" className={style.edit}>
					Edit Profile
				</CustomButton>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Edit Profile</Dialog.Title>
				</Dialog.Header>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className={style.form}>
						<EditProfileAvatar />
						<EditProfileForm form={form} />

						<CustomButton type="submit" radius="full" className={style.save}>
							Save
							<span className={style.iconArrowRight} />
						</CustomButton>
					</form>
				</Form>
			</Dialog.Content>
		</Dialog>
	)
}

export default EditProfileModal
