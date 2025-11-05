'use client'

import React from 'react'
import { Editor } from '@tiptap/react'
import { gitHubEmojis } from '@tiptap/extension-emoji'
import Popover from '@/components/atoms/popover/Popover'
import Tooltip from '@/components/atoms/tooltip/Tooltip'
import CustomButton from '@/components/atoms/button/CustomButton'

import styles from './EmojiPopover.module.scss'

interface EmojiPopoverProps {
	editor: Editor
}

// Popular emoji shortcodes from GitHub emojis
const POPULAR_EMOJIS = [
	'smile',
	'laughing',
	'heart',
	'heart_eyes',
	'thumbsup',
	'thumbsdown',
	'clap',
	'fire',
	'tada',
	'rocket',
	'star',
	'sparkles',
	'100',
	'ok_hand',
	'raised_hands',
	'pray',
	'thinking',
	'eyes',
	'wave',
	'muscle',
	'joy',
	'cry',
	'sweat_smile',
	'blush',
	'wink',
	'kissing_heart',
	'sunglasses',
	'relieved',
	'grin',
	'innocent',
]

const EMOJI_GROUPS = [
	{
		label: 'Popular',
		emojis: POPULAR_EMOJIS,
	},
	{
		label: 'Smileys',
		emojis: [
			'smile',
			'grin',
			'laughing',
			'blush',
			'innocent',
			'smiley',
			'joy',
			'sweat_smile',
			'grinning',
			'relaxed',
			'wink',
			'heart_eyes',
			'kissing_heart',
			'kissing_closed_eyes',
			'stuck_out_tongue_winking_eye',
			'stuck_out_tongue',
			'sleeping',
			'worried',
			'frowning',
			'anguished',
		],
	},
	{
		label: 'Gestures',
		emojis: [
			'thumbsup',
			'thumbsdown',
			'ok_hand',
			'punch',
			'fist',
			'v',
			'wave',
			'raised_hand',
			'open_hands',
			'point_up',
			'point_down',
			'point_left',
			'point_right',
			'raised_hands',
			'pray',
			'clap',
			'muscle',
			'metal',
			'call_me_hand',
			'handshake',
		],
	},
	{
		label: 'Emotions',
		emojis: [
			'heart',
			'yellow_heart',
			'green_heart',
			'blue_heart',
			'purple_heart',
			'broken_heart',
			'heartbeat',
			'heartpulse',
			'two_hearts',
			'sparkling_heart',
			'cupid',
			'gift_heart',
			'heart_decoration',
			'fire',
			'sparkles',
			'star',
			'dizzy',
			'boom',
			'tada',
			'confetti_ball',
		],
	},
]

function EmojiPopover({ editor }: EmojiPopoverProps) {
	const handleEmojiClick = (shortcode: string) => {
		const emojiData = gitHubEmojis.find(e => e.name === shortcode)
		if (emojiData?.emoji) {
			editor.chain().focus().insertContent(emojiData.emoji).run()
		}
	}

	return (
		<Tooltip>
			<Popover>
				<Tooltip.Trigger>
					<Popover.Trigger>
						<CustomButton
							type="button"
							variant="secondary"
							size="icon"
							radius="md"
							aria-label="Insert emoji"
							className={styles.button}
						>
							<span className={styles.emojiIcon} />
						</CustomButton>
					</Popover.Trigger>
				</Tooltip.Trigger>
				<Popover.Content className={styles.content}>
					<div className={styles.emojiPicker}>
						{EMOJI_GROUPS.map((group, groupIndex) => (
							<div key={groupIndex} className={styles.emojiGroup}>
								<div className={styles.groupLabel}>{group.label}</div>
								<div className={styles.emojiGrid}>
									{group.emojis.map((shortcode: string, emojiIndex: number) => {
										const emojiData = gitHubEmojis.find(e => e.name === shortcode)
										if (!emojiData) return null
										return (
											<CustomButton
												key={emojiIndex}
												type="button"
												variant="text"
												size="icon"
												radius="md"
												onClick={() => handleEmojiClick(shortcode)}
												aria-label={`:${shortcode}:`}
												title={`:${shortcode}:`}
												className={styles.emojiButton}
											>
												{emojiData.emoji}
											</CustomButton>
										)
									})}
								</div>
							</div>
						))}
					</div>
				</Popover.Content>
			</Popover>
			<Tooltip.Content>Emoji</Tooltip.Content>
		</Tooltip>
	)
}

export default EmojiPopover
