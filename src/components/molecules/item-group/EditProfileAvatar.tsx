import Avatar from '@/components/atoms/avatar/Avatar'
import CustomButton from '@/components/atoms/button/CustomButton'
import style from './EditProfileAvatar.module.scss'

function EditProfileAvatar() {
	return (
		<article className={style.card}>
			<section className={style.avatar}>
				<Avatar src={'/images/1.jpg'} alt="Avatar" size={43} />
				<p className={style.info}>
					<span className={style.username}>Jon Doe</span>
					<span className={style.name}>John Doe</span>
				</p>
			</section>
			<section className={style.action}>
				<CustomButton type="button" className={style.button}>
					Change Avatar
				</CustomButton>
			</section>
		</article>
	)
}

export default EditProfileAvatar
