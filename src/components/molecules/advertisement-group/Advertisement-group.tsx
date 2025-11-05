import Adbutler from '@/components/atoms/advertisement/Adbutler'
import style from './Advertisement-group.module.scss'

type AdvertisementGroupProps = {
	type?: 'sageai' | 'default'
}

const AdvertisementGroup = ({ type }: AdvertisementGroupProps) => {
	return (
		<div className={style.advertisementGroup}>
			<h6>Sponsored</h6>
			<div>
				<Adbutler type={type} />
				<Adbutler type={type} />
			</div>
		</div>
	)
}

export default AdvertisementGroup
