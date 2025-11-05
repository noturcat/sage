import Avatar from '@/components/atoms/avatar/Avatar'
import style from './ShareNew.module.scss'

function ShareNew() {
	return (
		<article className={style.share}>
			<Avatar src={'/images/1.jpg'} size={35} />
			<p className={style.label}>Share what’s new...</p>
		</article>
	)
}

export default ShareNew
