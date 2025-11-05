import CustomButton from '../../button/CustomButton'
import { Input } from '../../input/Input'
import styles from './ChatInput.module.scss'

function ChatInput() {
	return (
		<div className={styles.inputContainer}>
			<div className={styles.attachmentsContainer}>
				<CustomButton className={styles.emojiButton} variant="outline">
					<span className={styles.emojiIcon} />
				</CustomButton>
				<CustomButton className={styles.imageButton} variant="outline">
					<span className={styles.imageIcon} />
				</CustomButton>
				<CustomButton className={styles.gifButton} variant="outline">
					<span className={styles.gifIcon} />
				</CustomButton>
			</div>

			<div className={styles.verticalSeparator}></div>

			<Input
				id="message-input"
				name="message-input"
				type="text"
				placeholder="Type a message"
				radius="full"
				className={styles.input}
			/>

			<CustomButton className={styles.iconSendContainer} variant="outline">
				<span className={styles.iconSend} />
			</CustomButton>
		</div>
	)
}

export default ChatInput
