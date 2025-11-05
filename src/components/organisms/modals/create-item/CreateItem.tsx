'use client'

import { useEffect, ReactNode } from 'react'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './CreateItem.module.scss'

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen'
type ModalVariant = 'default' | 'centered' | 'top' | 'bottom'
type ModalTheme = 'light' | 'dark' | 'transparent'

type CreateItemProps = {
	// Core props
	open: boolean
	onClose: () => void
	onBack?: () => void
	// Content props
	title?: string
	children?: ReactNode
	showCloseButton?: boolean
	showBackButton?: boolean
	subtitle?: string
	// Layout props
	size?: ModalSize
	variant?: ModalVariant
	theme?: ModalTheme

	// Behavior props
	closeOnOverlayClick?: boolean
	closeOnEscape?: boolean
	preventBodyScroll?: boolean

	// Footer props
	showFooter?: boolean
	footerContent?: ReactNode
	primaryButton?: {
		label: string
		onClick: () => void
		variant?: 'primary' | 'secondary' | 'outlined' | 'ghost'
		disabled?: boolean
	}
	secondaryButton?: {
		label: string
		onClick: () => void
		variant?: 'primary' | 'secondary' | 'outlined' | 'ghost'
		disabled?: boolean
	}

	// Custom styling
	overlayClassName?: string
	contentClassName?: string
	headerClassName?: string
	bodyClassName?: string
	footerClassName?: string
}

const CreateItem = ({
	// Core props
	open,
	onClose,
	onBack,
	// Content props
	title,
	children,
	showCloseButton = true,
	showBackButton = false,
	// Layout props
	size = 'medium',
	variant = 'centered',
	theme = 'light',
	subtitle,
	// Behavior props
	closeOnOverlayClick = true,
	closeOnEscape = true,
	preventBodyScroll = true,

	// Footer props
	showFooter = false,
	footerContent,
	primaryButton,
	secondaryButton,

	// Custom styling
	overlayClassName,
	contentClassName,
	headerClassName,
	bodyClassName,
	footerClassName,
}: CreateItemProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && open && closeOnEscape) {
				onClose()
			}
		}

		if (open) {
			document.addEventListener('keydown', handleEscape)
			if (preventBodyScroll) {
				document.body.style.overflow = 'hidden'
			}
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			if (preventBodyScroll) {
				document.body.style.overflow = 'unset'
			}
		}
	}, [open, onClose, closeOnEscape, preventBodyScroll])

	const handleOverlayClick = () => {
		if (closeOnOverlayClick) {
			onClose()
		}
	}

	const handleContentClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	if (!open) return null

	// Build class names
	const overlayClasses = [
		style.modalOverlay,
		style[`variant-${variant}`],
		style[`theme-${theme}`],
		overlayClassName,
	]
		.filter(Boolean)
		.join(' ')

	const contentClasses = [
		style.modalContent,
		style[`size-${size}`],
		style[`variant-${variant}`],
		style[`theme-${theme}`],
		contentClassName,
	]
		.filter(Boolean)
		.join(' ')

	const headerClasses = [style.modalHeader, headerClassName].filter(Boolean).join(' ')

	const bodyClasses = [style.modalBody, bodyClassName].filter(Boolean).join(' ')

	const footerClasses = [style.modalFooter, footerClassName].filter(Boolean).join(' ')

	return (
		<div className={overlayClasses} onClick={handleOverlayClick}>
			<div className={contentClasses} onClick={handleContentClick}>
				{title && (
					<div className={headerClasses}>
						{showBackButton && (
							<ButtonIcon
								icon="/icons/back.svg"
								variant="text"
								styleType="icon"
								size={30}
								onClick={onBack}
							/>
						)}
						<div className={style.headerContent}>
							<h2 className={style.modalTitle}>{title}</h2>
							{subtitle && <p className={style.subtitle}>{subtitle}</p>}
						</div>
						{showCloseButton && (
							<ButtonIcon
								icon="/icons/close.svg"
								variant="text"
								styleType="icon"
								size={24}
								onClick={onClose}
								extraClass={style.closeButton}
							/>
						)}
					</div>
				)}

				<div className={bodyClasses}>{children}</div>

				{(showFooter || footerContent || primaryButton || secondaryButton) && (
					<div className={footerClasses}>
						{footerContent || (
							<div className={style.footerActions}>
								{secondaryButton && (
									<ButtonIcon
										label={secondaryButton.label}
										icon={''}
										variant={'text'}
										onClick={secondaryButton.onClick}
										type="button"
										styleType="outlined"
										size={24}
										iconPos="prepend"
									/>
								)}
								{primaryButton && (
									<ButtonIcon
										label={primaryButton.label}
										variant={'primary'}
										icon={'/icons/arrow-right.svg'}
										onClick={primaryButton.onClick}
										disabled={primaryButton.disabled}
										type="button"
										styleType="solid"
										size={24}
										iconPos="prepend"
									/>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default CreateItem
