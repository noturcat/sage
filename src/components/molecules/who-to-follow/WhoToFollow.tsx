'use client'

import { useState } from 'react'
import Follow from '@/components/molecules/avatar-group/Follow'
import { follow } from '@/components/pages/protocols/follow'
import style from './WhoToFollow.module.scss'

function WhoToFollow() {
	const [showMore, setShowMore] = useState(false)

	const handleSeeMore = () => {
		setShowMore(!showMore)
	}
	return (
		<div className={style.whoToFollow}>
			<h6>Who to Follow</h6>

			{follow.slice(0, showMore ? follow.length : 3).map((follow, index) => (
				<div key={index} className={style.whoToFollowList}>
					<Follow {...follow} />
				</div>
			))}

			{showMore ? (
				<p className={style.seeMore} onClick={handleSeeMore}>
					See Less Suggestions
				</p>
			) : (
				<p className={style.seeMore} onClick={handleSeeMore}>
					See More Suggestions
				</p>
			)}
		</div>
	)
}

export default WhoToFollow
