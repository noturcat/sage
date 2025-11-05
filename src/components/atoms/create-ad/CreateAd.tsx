import ButtonIcon from '../button/ButtonIcon'
import style from './CreateAd.module.scss'

const CreateAd = ({
	title,
	description,
	image,
	onClick,
}: {
	title: string
	description: string
	image: string
	onClick: () => void
}) => {
	return (
		<div className={style.wrapper} onClick={onClick}>
			<div className={style.image}>
				<ButtonIcon
					icon={image}
					variant="text"
					styleType="icon"
					size={40}
					tintColor="var(--jh-gray-01)"
				/>
			</div>
			<div className={style.content}>
				<span className={style.title}>{title}</span>
				<span className={style.description}>{description}</span>
			</div>
			<div className={style.next}>
				<ButtonIcon icon="/icons/chevron-right.svg" variant="text" styleType="icon" size={24} />
			</div>
		</div>
	)
}

export default CreateAd
