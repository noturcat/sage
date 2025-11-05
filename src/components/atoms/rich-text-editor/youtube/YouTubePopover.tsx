'use client'

import { useState, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Popover from '@/components/atoms/popover/Popover'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import styles from './YouTubePopover.module.scss'

interface YouTubePopoverProps {
	editor: Editor
	onClose?: () => void
}

function YouTubePopover({ editor, onClose }: YouTubePopoverProps) {
	const [url, setUrl] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const inputCallbackRef = useCallback((node: HTMLInputElement | null) => {
		inputRef.current = node
		if (node) {
			node.focus()
			node.select()
		}
	}, [])

	const handleApplyYouTube = () => {
		if (url.trim()) {
			editor.commands.setYoutubeVideo({
				src: url,
				width: Math.max(320, parseInt('640', 10)) || 640,
				height: Math.max(180, parseInt('480', 10)) || 480,
			})
		}
		onClose?.()
	}

	const handleRemoveYouTube = () => {
		if (editor.isActive('youtube')) {
			editor.chain().focus().deleteNode('youtube').run()
		}
		onClose?.()
	}

	const handleOpenYouTube = () => {
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	}

	const handleUndoYouTube = () => {
		editor.chain().focus().undo().run()
		onClose?.()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose?.()
		} else if (e.key === 'Enter') {
			handleApplyYouTube()
		}
	}

	const disabled = !url.trim()

	const buttonGroups = [
		{
			icon: <span className={styles.applyIcon} />,
			onClick: handleApplyYouTube,
			name: 'Apply',
			ariaLabel: 'Apply YouTube',
		},
		{
			icon: <span className={styles.undoIcon} />,
			onClick: handleUndoYouTube,
			name: 'Undo',
			ariaLabel: 'Undo YouTube',
		},
		{
			icon: <span className={styles.externalIcon} />,
			onClick: handleOpenYouTube,
			name: 'Open',
			ariaLabel: 'Open YouTube',
		},
		{
			icon: <span className={styles.deleteIcon} />,
			onClick: handleRemoveYouTube,
			name: 'Remove',
			ariaLabel: 'Remove YouTube',
		},
	]

	return (
		<Tooltip>
			<Popover>
				<Tooltip.Trigger>
					<Popover.Trigger>
						<button type="button" className={styles.trigger} aria-label="Add YouTube video">
							<span className={styles.youtubeIcon} />
						</button>
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
							placeholder="Paste a YouTube URL..."
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
			<Tooltip.Content>YouTube</Tooltip.Content>
		</Tooltip>
	)
}

export default YouTubePopover
