import { useRef } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './EditCoverPhoto.module.scss'

function EditCoverPhoto() {
	const fileInputRef = useRef<HTMLInputElement>(null)

	return (
		<>
			<input type="file" ref={fileInputRef} className={style.input} />
			<CustomButton
				variant="secondary"
				radius="full"
				size="icon"
				className={style.edit}
				onClick={() => {
					fileInputRef.current?.click()
				}}
			>
				<span className={style.iconEdit} />
			</CustomButton>
		</>
	)
}

export default EditCoverPhoto
