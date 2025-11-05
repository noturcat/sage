import { useRouter } from 'next/navigation'
import CustomButton from '@/components/atoms/button/CustomButton'
import styles from './ChatRequestPrompt.module.scss'
import ActivePingIndicator from '@/components/atoms/active-ping-indicator/ActivePingIndicator'

function ChatRequestPrompt() {
	const router = useRouter()

	const handleClick = () => {
		router.push(`/messages/requests`)
	}

	return (
		<div className={styles.messageRequestContainer} onClick={handleClick}>
			<CustomButton variant="text" radius="full" className={styles.messageRequestButton}>
				<span className={styles.iconRequest} />
			</CustomButton>

			<div className={styles.messageRequestText}>
				<span className={styles.messageRequestTitle}>Message Requests</span>
				<span className={styles.messageRequestCount}>1 new request</span>
			</div>

			<ActivePingIndicator size="small" color="green" />
		</div>
	)
}

export default ChatRequestPrompt
