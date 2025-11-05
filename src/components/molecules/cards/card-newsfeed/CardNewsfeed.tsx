import Image from 'next/image'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'
import Avatar from '@/components/atoms/avatar/Avatar'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import CustomButton from '@/components/atoms/button/CustomButton'
import { icons, options } from '@/components/molecules/cards/card-newsfeed/newsfeed'

import style from './CardNewsfeed.module.scss'

interface CardNewsfeedProps {
	variant?: 'post' | 'shared' | 'reposted'
	name?: string
	sharedBy?: string
	groupName?: string
	timeElapsed?: string
	imageUrl?: string
	membersCount?: string
	message?: string
}

function CardNewsfeed({
	variant = 'post',
	name = 'name',
	sharedBy = 'sharedBy',
	groupName = 'groupName',
	timeElapsed = 'timeElapsed',
	imageUrl = '/images/newsfeed-image.jpg',
	membersCount = 'membersCount',
	message = 'message',
}: CardNewsfeedProps) {
	return (
		<div className={style.card}>
			<header className={style.header}>
				<section className={style.authorInfo}>
					<Avatar src="/images/avatar-placeholder.png" size={34} />
					<div className={style.info}>
						<p className={style.post}>
							<span className={style.name}>{name}</span>
							{variant === 'shared' && <span className={style.sharedBy}>{sharedBy}</span>}
							{variant === 'shared' && <span className={style.groupName}>{groupName}</span>}
						</p>
						<p className={style.postInfo}>
							<span className={style.timeElapsed}>{timeElapsed}</span>
							<span className={style.iconPrivacy} />
						</p>
					</div>
				</section>
				<DropdownMenu>
					<DropdownMenu.Trigger>
						<span className={style.iconEllipsis} />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content className={style.content}>
						{options.map(option => (
							<DropdownMenu.Item key={option.id} onClick={option.onClick}>
								<span className={style.iconArrow} />
								{option.label}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu>
			</header>
			<main className={style.body}>
				<RichTextContent
					html={[{ type: 'paragraph', content: [{ type: 'text', text: message }] }]}
				/>

				{variant === 'shared' && (
					<div className={style.image}>
						<Image
							src={imageUrl}
							alt="newsfeed image"
							fill
							sizes="100%"
							className={style.imageElement}
						/>

						<div className={style.imageOverlay}>
							<p className={style.overlayContent}>
								<span className={style.membersCount}>{membersCount}</span>
								<span className={style.groupName}>{groupName}</span>
							</p>
							<CustomButton radius="full" className={style.joinButton}>
								Join
							</CustomButton>
						</div>
					</div>
				)}
			</main>
			<footer className={style.footer}>
				<section className={style.icons}>
					{icons.map(icon => (
						<div key={icon.id} className={style.icon}>
							<CustomButton variant="text" size="icon" radius="full">
								<span className={style[icon.icon]} />
							</CustomButton>
							{icon.count}
						</div>
					))}
				</section>
			</footer>
		</div>
	)
}

export default CardNewsfeed
