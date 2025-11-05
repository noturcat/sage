import { UseFormReturn } from 'react-hook-form'
import { MultiSelectInput } from '@/components/atoms/form/select/MultiSelect'
import { FormInput } from '@/components/atoms/input/Input'
import { DatePickerInput } from '@/components/atoms/form/date-picker/DatePicker'
import { EditProfileSchema } from '@/components/pages/profile/editProfile.schema'
import { interests } from '@/components/pages/profile/interests'
import style from './EditProfileForm.module.scss'

interface EditProfileFormProps {
	form: UseFormReturn<EditProfileSchema>
}

function EditProfileForm({ form }: EditProfileFormProps) {
	return (
		<main className={style.form}>
			<section className={style.name}>
				<div className={style.firstName}>
					<FormInput
						type="text"
						label="Name:"
						placeholder="First Name"
						name="first_name"
						form={form}
					/>
				</div>
				<div className={style.lastName}>
					<FormInput type="text" placeholder="Last Name" name="last_name" form={form} />
				</div>
			</section>
			<section>
				<FormInput type="text" label="Bio:" placeholder="Bio" name="bio" form={form} />
			</section>
			<section
				className={style.address}
				data-error={form.formState.errors.username || form.formState.errors.address}
			>
				<div className={style.username}>
					<FormInput
						type="text"
						label="Username:"
						placeholder="Username"
						name="username"
						form={form}
					/>
				</div>
				<div className={style.address}>
					<FormInput
						type="text"
						label="Address:"
						placeholder="Address"
						name="address"
						form={form}
					/>
				</div>
			</section>
			<section className={style.website}>
				<div className={style.website}>
					<FormInput
						type="text"
						label="Website:"
						placeholder="Website"
						name="website"
						form={form}
					/>
				</div>
				<div className={style.birthday}>
					<DatePickerInput label="Birthday:" placeholder="Birthday" name="birthday" form={form} />
				</div>
			</section>
			<section className={style.interests}>
				<MultiSelectInput
					options={interests}
					label="Interests:"
					name="interests"
					form={form}
					className={style.multiselect}
				/>
			</section>
		</main>
	)
}

export default EditProfileForm
