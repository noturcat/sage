import Avatar from '../avatar/Avatar'
import style from './SharePost.module.scss'
type SharePostProps = {
	avatar?: string
	placeholder?: string
	size?: number
}
const SharePost = ({
	avatar = '/images/1.jpg',
	placeholder = 'Share your thoughts',
	size = 32,
}: SharePostProps) => {
	return (
		<div className={style.sharePost}>
			<Avatar src={avatar} size={size} />
			<input type="text" placeholder={placeholder} className={style.sharePostInput} />
		</div>
	)
}

export default SharePost
