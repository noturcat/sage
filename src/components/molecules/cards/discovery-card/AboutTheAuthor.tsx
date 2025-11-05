'use client'

import { useState } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Avatar from '@/components/atoms/avatar/Avatar'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { AuthorAttributesType } from '@/types/Author.type'
import style from './AboutTheAuthor.module.scss'

export type Author = AuthorAttributesType & {
	id: string
}

interface AboutTheAuthorProps {
	author: Author
	loading?: boolean	
}

function AboutTheAuthor({ author, loading }: AboutTheAuthorProps) {
	const [isFollowing, setIsFollowing] = useState(false)

	const handleFollow = () => {
		setIsFollowing(!isFollowing)
	}

	return (
		<main className={style.about}>
			<div className={style.title}>About the Author</div>
			{loading ? (
				<div className={style.skeletonGroup}>
					<Skeleton className={style.imageSkeleton} />
					<div className={style.contentSkeleton}>
						<div className={style.headerSkeleton}>
							<Skeleton className={style.nameSkeleton} />
							<Skeleton className={style.followButtonSkeleton} />
						</div>
						<Skeleton className={style.descriptionSkeleton} />
					</div>
				</div>
			) : (
				<article className={style.article}>
					<section>
						<Avatar src={'/images/avatar-placeholder.png'} size={58} />
					</section>
					<section className={style.content}>
						<div className={style.header}>
							<h4 className={style.name}>
								{author.first_name} {author.last_name}
							</h4>
							<CustomButton
								variant={isFollowing ? 'secondary' : 'outline'}
								radius="full"
								className={isFollowing ? style.followingButton : style.followButton}
								onClick={handleFollow}
							>
								{isFollowing ? 'Following' : 'Follow'}
							</CustomButton>
						</div>
						<p className={style.description}>{author.bio}</p>
					</section>
				</article>
			)}
		</main>
	)
}

export default AboutTheAuthor
