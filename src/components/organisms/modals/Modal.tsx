'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './Modal.module.scss'

type ModalProps = {
	show: boolean
	onClose: () => void
	onBack?: () => void
	children?: React.ReactNode
	modalTitle?: string
	hideHeaderActions?: boolean
}

const Modal = ({
	show,
	onClose,
	onBack,
	children,
	modalTitle,
	hideHeaderActions = false,
}: ModalProps) => {
	const [visible, setVisible] = useState(show)

	const isTitleless = !modalTitle && !onBack

	const handleExitComplete = () => {
		setVisible(false)
		onClose()
	}

	useEffect(() => {
		if (show) {
			setVisible(true)
		}
	}, [show])

	return (
		<div className={style.modalContainer}>
			<AnimatePresence onExitComplete={handleExitComplete}>
				{visible && (
					<>
						<motion.div
							key="backdrop"
							className={style.backdrop}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						/>

						<motion.div
							key="modal"
							className={style.modal}
							initial={{ opacity: 0, scale: 0.95, y: 30 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -30 }}
							transition={{ duration: 0.3 }}
						>
							{!hideHeaderActions && (
								<div className={`${style.actions} ${isTitleless ? style.justifyEnd : ''}`}>
									{onBack && (
										<ButtonIcon
											variant={'text'}
											styleType={'icon'}
											icon={'/icons/back.svg'}
											size={38}
											onClick={onBack}
										/>
									)}

									{modalTitle && <div className={style.title}>{modalTitle}</div>}

									<ButtonIcon
										variant={'text'}
										styleType={'icon'}
										icon={'/icons/close.svg'}
										size={24}
										onClick={() => setVisible(false)}
									/>
								</div>
							)}
							<div className={style.content}>{children}</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Modal
