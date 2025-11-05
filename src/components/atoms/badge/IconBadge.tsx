import Image from 'next/image';
import style from './Badge.module.scss';

type IconBadgeProps = {
	icon: string
	size?: number
	extraClass?: string
};

const IconBadge = ({
	icon,
	size = 28,
	extraClass
}: IconBadgeProps) => {
	return (
		<div
			className={`${style.iconBadge} ${extraClass ?? ''}`}
			style={{
				width: size,
				height: size,
			}}
		>
			<Image src={icon} width={12} height={12} alt={'icon'} />
		</div>
	);
}

export default IconBadge
