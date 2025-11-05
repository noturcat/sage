import Image from 'next/image'
import style from './Avatar.module.scss'

type AvatarProps = {
	src: string
	alt?: string
	size?: number
	zIndex?: number
	extraClass?: string
	onClick?: () => void
}

const Avatar = ({
	src,
	alt = 'Avatar',
	size = 35,
	zIndex = 1,
	extraClass = '',
	onClick,
}: AvatarProps) => {
	return (
		<div
			className={`${style.avatar} ${extraClass}`}
			style={{
				width: size,
				height: size,
				zIndex,
			}}
			onClick={onClick}
		>
			<Image src={src} alt={alt} width={size} height={size} className={style.image} />
		</div>
	)
}

export default Avatar
