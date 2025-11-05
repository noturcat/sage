import AdvancedBreadcrumb from '@/components/atoms/breadcrumb/Breadcrumb'
import Container from '@/components/util/container/Container'
import style from './DiscoverHeader.module.scss'

const DiscoverHeader = () => {
	return (
		<div className={style.wrapper}>
			<Container>
				<AdvancedBreadcrumb />
			</Container>
		</div>
	)
}

export default DiscoverHeader
