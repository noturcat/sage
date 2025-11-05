import styles from './EmptyInbox.module.scss'

interface EmptyInboxProps {
	message?: string
	description?: string
}

function EmptyInbox({
	message = 'Inbox is empty',
	description = 'You should message someone!',
}: EmptyInboxProps) {
	return (
		<div className={styles.emptyInboxContainer}>
			<span className={styles.emptyInboxIcon} />
			<span className={styles.emptyInboxText}>{message}</span>
			<span className={styles.emptyInboxDescription}>{description}</span>
		</div>
	)
}

export default EmptyInbox
