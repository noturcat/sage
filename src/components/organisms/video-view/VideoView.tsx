'use client'
import { useRef } from 'react'
import Video from '@/components/molecules/video/Video'
import { mockVideoCards, TrendingVideos } from '@/mocks/dummyData'
import NoDataPage from '@/components/organisms/no-data-page/NoDataPage'
import Avatar from '@/components/atoms/avatar/Avatar'
import { TrendingSort } from '@/mocks/dummyData'
import Sort from '@/components/atoms/sort/Sort'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './VideoView.module.scss'
type VideoViewProps = {
	title: string
	view: 'grid' | 'list' | 'single' | 'three-col' | 'window' | 'scrollable'
	filter: true | false
}
const VideoView = ({ view, title, filter }: VideoViewProps) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const handleNext = () => {
		if (scrollContainerRef.current) {
			const videoWidth = 200 + 16
			scrollContainerRef.current.scrollBy({
				left: videoWidth,
				behavior: 'smooth',
			})
		}
	}

	const handlePrev = () => {
		if (scrollContainerRef.current) {
			const videoWidth = 200 + 16
			scrollContainerRef.current.scrollBy({
				left: -videoWidth,
				behavior: 'smooth',
			})
		}
	}
	return (
		<div className={style.wrapper}>
			<div className={style.wrapperRight}>
				{mockVideoCards.length > 0 ? (
					<>
						<div className={style.wrapperHeader}>
							<div> {title}</div>
							{filter && (
								<Sort items={TrendingSort.map(item => ({ key: item.value, label: item.label }))} />
							)}
						</div>
						{view === 'grid' && (
							<div className={style.wrapperGrid}>
								{mockVideoCards.map((video, index) => (
									<Video key={index} videoSrc={video.videoSrc} view={view} />
								))}
							</div>
						)}
						{view === 'list' && (
							<div className={style.wrapperList}>
								{mockVideoCards.map((video, index) => (
									<div className={style.wrapperListVideo} key={index}>
										<div className={style.videoThumbnail}>
											<Video key={index} videoSrc={video.videoSrc} view={view} />
										</div>
										<div className={style.videoInfo}>
											<h3 className={style.videoTitle}>{video.title}</h3>
											<p className={style.videoAuthor}>{video.author.name}</p>
											<div className={style.videoStats}>
												<span className={style.videoViews}>{video.views} views</span>
												<span className={style.videoLikes}>{video.likes} likes</span>
												<span className={style.videoComments}>{video.comments} comments</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						{view === 'single' && (
							<div className={style.wrapperSingle}>
								{mockVideoCards.map((video, index) => (
									<div className={style.wrapperSingleVideoContainer} key={index}>
										<div className={style.wrapperSingleVideoHeader}>
											<div className={style.wrapperSingleVideoAuthor}>
												<Avatar src={video.author.avatar} size={32} />
												<div className={style.wrapperSingleVideoAuthorName}>
													{video.author.name}
												</div>
											</div>
											<div className={style.wrapperSingleVideoTitle}>{video.title}</div>
											<div className={style.wrapperSingleVideoDescription}>{video.description}</div>
										</div>
										<div className={style.wrapperSingleVideo} key={index}>
											<Video key={index} videoSrc={video.videoSrc} view={view} />
										</div>
										<div className={style.wrapperSingleVideoStats}>
											<div className={style.wrapperSingleVideoStatsItem}>
												<span className={style.wrapperSingleVideoStatsItemValue}>
													{video.views}
												</span>
												<span className={style.wrapperSingleVideoStatsItemLabel}>views</span>
											</div>
											<div className={style.wrapperSingleVideoStatsItem}>
												<span className={style.wrapperSingleVideoStatsItemValue}>
													{video.likes}
												</span>
												<span className={style.wrapperSingleVideoStatsItemLabel}>likes</span>
											</div>
											<div className={style.wrapperSingleVideoStatsItem}>
												<span className={style.wrapperSingleVideoStatsItemValue}>
													{video.comments}
												</span>
												<span className={style.wrapperSingleVideoStatsItemLabel}>comments</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						{view === 'window' && (
							<div className={style.wrapperWindow}>
								{TrendingVideos.map((video, index) => (
									<Video key={index} videoSrc={video.videoSrc} view={view} />
								))}
							</div>
						)}
						{view === 'scrollable' && (
							<div className={style.wrapperScrollable}>
								<div ref={scrollContainerRef} className={style.scrollContainer}>
									{mockVideoCards.map((video, index) => (
										<Video key={index} videoSrc={video.videoSrc} view={view} />
									))}
								</div>
								<div className={style.navigationControls}>
									<ButtonIcon
										icon="/icons/chevron-left.svg"
										variant="circular"
										styleType="icon"
										onClick={handlePrev}
										extraClass={style.extraClass}
										tintColor="var(--jh-green-01)"
									/>
									<ButtonIcon
										icon="/icons/chevron-right.svg"
										variant="circular"
										styleType="icon"
										onClick={handleNext}
										extraClass={style.extraClass}
										tintColor="var(--jh-green-01)"
									/>
								</div>
							</div>
						)}
					</>
				) : (
					<NoDataPage title="Videos" icon="/icons/videos.svg" />
				)}
			</div>
		</div>
	)
}

export default VideoView
