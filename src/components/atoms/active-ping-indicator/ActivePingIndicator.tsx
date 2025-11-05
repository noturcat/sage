'use client'

import styles from './ActivePingIndicator.module.scss'

interface ActivePingIndicatorProps {
	size?: 'small' | 'medium' | 'large'
	color?: 'green' | 'red' | 'blue'
	className?: string
	pulse?: boolean
}

function ActivePingIndicator({
	size = 'medium',
	color = 'green',
	className = '',
	pulse = false,
}: ActivePingIndicatorProps) {
	return (
		<div className={`${styles.pingContainer} ${styles[size]} ${styles[color]} ${className}`}>
			<div className={styles.pingDot}></div>
			{pulse && (
				<>
					<div className={styles.pingRing}></div>
					<div className={styles.pingRing}></div>
				</>
			)}
		</div>
	)
}

export default ActivePingIndicator
