import style from './Adbutler.module.scss'

const Adbutler = ({ type }: { type?: 'sageai' | 'default' }) => {
	return (
		<iframe
			src={type === 'sageai' ? '/adbutler-sageai-slot.html' : '/adbutler-slot.html'}
			className={style.adbutler}
		/>
	)
}

export default Adbutler
