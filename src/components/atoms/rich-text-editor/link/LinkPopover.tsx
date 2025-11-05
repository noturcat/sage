'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import Popover from '@/components/atoms/popover/Popover'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import CustomButton from '@/components/atoms/button/CustomButton'

import styles from './LinkPopover.module.scss'

interface LinkPopoverProps {
	editor: Editor
	onClose?: () => void
}

function LinkPopover({ editor, onClose }: LinkPopoverProps) {
	const [url, setUrl] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (editor.isActive('link')) {
			const linkAttributes = editor.getAttributes('link')
			setUrl(linkAttributes.href || '')
		}
	}, [editor])

	const inputCallbackRef = useCallback((node: HTMLInputElement | null) => {
		inputRef.current = node
		if (node) {
			node.focus()
			node.select()
		}
	}, [])

	const handleApplyLink = () => {
		if (url.trim()) {
			if (editor.state.selection.empty) {
				editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run()
			} else {
				editor.chain().focus().setLink({ href: url }).run()
			}
		}
		onClose?.()
	}

	const handleRemoveLink = () => {
		editor.chain().focus().unsetLink().run()
		onClose?.()
	}

	const handleOpenLink = () => {
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	}

	const handleUndoLink = () => {
		editor.chain().focus().undo().run()
		onClose?.()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose?.()
		} else if (e.key === 'Enter') {
			handleApplyLink()
		}
	}

	const disabled = !url.trim()

	const buttonGroups = [
		{
			icon: <span className={styles.applyIcon} />,
			onClick: handleApplyLink,
			name: 'Apply',
			ariaLabel: 'Apply link',
		},
		{
			icon: <span className={styles.undoIcon} />,
			onClick: handleUndoLink,
			name: 'Undo',
			ariaLabel: 'Undo link',
		},
		{
			icon: <span className={styles.externalIcon} />,
			onClick: handleOpenLink,
			name: 'Open',
			ariaLabel: 'Open link',
		},
		{
			icon: <span className={styles.deleteIcon} />,
			onClick: handleRemoveLink,
			name: 'Remove',
			ariaLabel: 'Remove link',
		},
	]

	return (
		<Tooltip>
			<Popover>
				<Tooltip.Trigger>
					<Popover.Trigger>
						<CustomButton
							variant="text"
							type="button"
							size="icon"
							className={styles.trigger}
							aria-label="Edit link"
						>
							<span className={styles.linkIcon} />
						</CustomButton>
					</Popover.Trigger>
				</Tooltip.Trigger>
				<Popover.Content className={styles.content}>
					<div className={styles.inputContainer}>
						<input
							ref={inputCallbackRef}
							type="url"
							value={url}
							onChange={e => setUrl(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Paste a link..."
							className={styles.input}
							autoComplete="off"
							spellCheck="false"
						/>

						{/* Action Buttons */}
						<section className={styles.actions}>
							{buttonGroups.map((button, buttonIndex) => (
								<div key={buttonIndex} className={styles.actionContainer}>
									<Tooltip>
										<Tooltip.Trigger>
											<CustomButton
												variant="text"
												type="button"
												size="icon"
												onClick={button.onClick}
												aria-label={button.ariaLabel}
												disabled={disabled}
												className={styles.actionButton}
											>
												{button.icon}
											</CustomButton>
										</Tooltip.Trigger>
										<Tooltip.Content>{button.name}</Tooltip.Content>
									</Tooltip>
									{buttonIndex === 0 && <div className={styles.separator} />}
								</div>
							))}
						</section>
					</div>
				</Popover.Content>
			</Popover>
			<Tooltip.Content>Link</Tooltip.Content>
		</Tooltip>
	)
}

export default LinkPopover
