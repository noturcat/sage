'use client'

import { useState } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import styles from './ChatDetails.module.scss'
import { useRouter } from 'next/navigation'
import ChatHeader from './ChatHeader'
import Separator from '@/components/atoms/separator/Separator'
import Switch from '@/components/atoms/switch/Switch'

function ChatDetails() {
	const [isMuted, setIsMuted] = useState(false)
	const router = useRouter()

	const handleBackClick = () => {
		router.back()
	}

	return (
		<main className={styles.chatDetailsContainer}>
			<section className={styles.chatDetailsHeader}>
				<h1 className={styles.title}>
					<CustomButton onClick={handleBackClick} variant="text" className={styles.iconBackButton}>
						<span className={styles.iconBack} />
					</CustomButton>
					Details
				</h1>
			</section>

			<Separator />

			<section className={styles.chatDetailsUser}>
				<ChatHeader compact hideDetailsButton />
			</section>

			<Separator />

			{/* Mute Messages */}
			<section className={styles.muteMessagesContainer}>
				{/* Icon Bell */}
				<div className={styles.muteMessagesContent}>
					<span className={styles.iconBell} />
					<span className={styles.muteMessagesTitle}>Mute Messages</span>
				</div>

				{/* Toggle Switch */}
				<Switch checked={isMuted} onCheckedChange={setIsMuted} />
			</section>

			<Separator />

			<section className={styles.mainDetailsContainer}>{/* No Content Yet */}</section>

			<Separator />

			<section className={styles.actionsContainer}>
				<div className={styles.actionItem}>
					<span className={styles.iconReport}></span>
					<span>Report</span>
				</div>
				<div className={styles.actionItem}>
					<span className={styles.iconBlock}></span>
					<span>Block</span>
				</div>
				<div className={styles.actionItem}>
					<span className={styles.iconDelete}></span>
					<span>Delete Chat</span>
				</div>
			</section>
		</main>
	)
}

export default ChatDetails
