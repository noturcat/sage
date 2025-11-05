'use client'
import { useEffect, useRef, useState } from 'react'
import style from './Video.module.scss'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'

const MAX_VOL = 0.25
type VideoProps = {
	videoSrc: string
	view: 'grid' | 'list' | 'single' | 'window' | 'scrollable'
}

const Video = ({ videoSrc, view }: VideoProps) => {
	const videoRef = useRef<HTMLVideoElement>(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const [isUserPlaying, setIsUserPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(MAX_VOL)
	const [isMuted, setIsMuted] = useState(true)
	const [showThumbnail, setShowThumbnail] = useState(true)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		// Enforce cap on init
		video.volume = Math.min(video.volume || MAX_VOL, MAX_VOL)

		// Set initial thumbnail position
		if (showThumbnail && video.duration > 10) {
			video.currentTime = 10
			video.pause()
		}

		const onPlay = () => {
			setIsPlaying(true)
			setShowThumbnail(false)
		}
		const onPause = () => setIsPlaying(false)
		const onTime = () => setProgress(video.duration ? video.currentTime / video.duration : 0)
		const onLoaded = () => {
			setDuration(video.duration || 0)
			if (showThumbnail && video.duration > 10) {
				video.currentTime = 10
				video.pause()
			}
		}

		const onCanPlay = () => {
			// Set video to 10-second mark for thumbnail
			if (showThumbnail && video.duration > 10) {
				video.currentTime = 10
				video.pause()
			}
		}
		const onVolume = () => {
			// hard cap any external/programmatic changes
			if (video.volume > MAX_VOL) video.volume = MAX_VOL
			setVolume(video.volume)
			setIsMuted(video.muted)
		}

		video.addEventListener('play', onPlay)
		video.addEventListener('pause', onPause)
		video.addEventListener('timeupdate', onTime)
		video.addEventListener('loadedmetadata', onLoaded)
		video.addEventListener('canplay', onCanPlay)
		video.addEventListener('volumechange', onVolume)

		// sync state once after mounting
		setVolume(video.volume)
		setIsMuted(video.muted)

		return () => {
			video.removeEventListener('play', onPlay)
			video.removeEventListener('pause', onPause)
			video.removeEventListener('timeupdate', onTime)
			video.removeEventListener('loadedmetadata', onLoaded)
			video.removeEventListener('canplay', onCanPlay)
			video.removeEventListener('volumechange', onVolume)
		}
	}, [showThumbnail])

	const handleMouseEnter = () => {
		const video = videoRef.current
		if (!video || isUserPlaying) return
		setShowThumbnail(false)
		video.currentTime = 0
		video.play().catch(() => {})
	}
	const handleMouseLeave = () => {
		const video = videoRef.current
		if (!video || isUserPlaying) return
		video.pause()
		video.currentTime = 10 // Reset to 10-second mark for thumbnail
		setShowThumbnail(true)
	}

	const togglePlay = () => {
		const video = videoRef.current
		if (!video) return
		if (!isUserPlaying) setIsUserPlaying(true)
		setShowThumbnail(false)
		if (video.paused) video.play()
		else video.pause()
	}

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const video = videoRef.current
		if (!video) return
		const p = Number(e.target.value) // 0..100
		const t = (p / 100) * (video.duration || 0)
		video.currentTime = t
		setProgress(video.duration ? t / video.duration : 0)
	}

	const handleMute = () => {
		const video = videoRef.current
		if (!video) return
		if (video.muted) {
			video.muted = false
			if (video.volume === 0) video.volume = MAX_VOL
		} else {
			video.muted = true
		}
		setIsMuted(video.muted)
		setVolume(video.volume)
	}

	const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
		const video = videoRef.current
		if (!video) return
		const volPercent = Math.min(Math.max(Number(e.target.value), 0), 25)
		const vol = volPercent / 100 // 0..0.25
		video.volume = vol
		video.muted = vol === 0
		setVolume(video.volume)
		setIsMuted(video.muted)
	}

	const toggleFullscreen = () => {
		const video = videoRef.current
		if (!video) return
		if (document.fullscreenElement) {
			document.exitFullscreen()
		} else {
			video.requestFullscreen().catch(() => {})
		}
	}

	const fmt = (s: number) => {
		if (!isFinite(s)) return '0:00'
		const m = Math.floor(s / 60)
		const sec = Math.floor(s % 60)
		return `${m}:${sec.toString().padStart(2, '0')}`
	}

	return (
		<div
			className={`${style.wrapper} ${view === 'grid' ? style.gridView : ''} ${view === 'window' ? style.windowView : ''} ${view === 'single' ? style.singleView : ''} ${view === 'list' ? style.listView : ''} ${view === 'scrollable' ? style.scrollableView : ''}`}
		>
			<div
				className={`${style.videoWrapper} ${view === 'list' ? style.listWrapper : ''} ${view === 'single' ? style.singleWrapper : ''} ${view === 'grid' ? style.gridWrapper : ''} ${view === 'window' ? style.windowWrapper : ''} ${view === 'scrollable' ? style.scrollableWrapper : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<video
					ref={videoRef}
					className={`${style.video} ${view === 'single' ? style.single : ''} ${view === 'list' ? style.list : ''} ${view === 'window' ? style.window : ''} ${view === 'scrollable' ? style.scrollable : ''} ${view === 'scrollable' ? style.scrollable : ''}`}
					src={videoSrc}
					playsInline
					muted={isMuted}
					preload="metadata"
				/>
				<div className={style.likeWrapper}>
					<ButtonIcon
						key={'Like'}
						icon={'/icons/heart-white.svg'}
						label={''}
						variant="text"
						styleType="icon"
						size={24}
						iconPos="append"
					/>
				</div>
				<div className={style.volumeWrapper}>
					<input
						type="range"
						min={0}
						max={25}
						value={Math.round(volume * 100)}
						onChange={handleVolume}
						aria-label="Volume"
						className={style.volume}
					/>
					<div onClick={handleMute} className={style.btn} aria-label={isMuted ? 'Unmute' : 'Mute'}>
						{isMuted ? (
							<ButtonIcon
								key={'Mute'}
								icon={'/icons/mute.svg'}
								label={''}
								variant="text"
								styleType="icon"
								size={30}
								iconPos="append"
							/>
						) : (
							'🔈'
						)}
					</div>
				</div>
				<div className={style.controls}>
					{view !== 'grid' && view !== 'window' && view !== 'scrollable' && (
						<input
							type="range"
							min={0}
							max={100}
							step={0.1}
							value={Math.round(progress * 100)}
							onChange={handleSeek}
							aria-label="Seek"
							className={style.seek}
						/>
					)}
					<div className={style.row}>
						{view !== 'grid' && view !== 'window' && view !== 'scrollable' && (
							<button
								onClick={togglePlay}
								className={style.btn}
								aria-label={isPlaying ? 'Pause' : 'Play'}
							>
								{isPlaying ? '⏸' : '▶'}
							</button>
						)}
						{view !== 'grid' && view !== 'window' && view !== 'scrollable' && (
							<div className={style.time}>
								{fmt(videoRef.current?.currentTime || 0)} / {fmt(duration)}
							</div>
						)}
						{view !== 'grid' && view !== 'window' && view !== 'scrollable' && (
							<button onClick={toggleFullscreen} className={style.btn} aria-label="Fullscreen">
								⛶
							</button>
						)}
					</div>
				</div>
			</div>
			<div className={style.videoInfo}>
				<div className={style.videoTitle}>
					The holistic guide to wellness fgjkbsafjksabfkjasbfkas
				</div>
				<div className={style.videoAuthor}>
					<div className={style.videoAuthorName}>
						<ButtonIcon
							key={'Mute'}
							icon={'/images/1.jpg'}
							label={''}
							variant="text"
							styleType="icon"
							size={15}
							iconPos="append"
							extraClass={style.extra}
						/>
						<span>John Doe</span>
					</div>
					{view !== 'scrollable' && <>{' • '}</>}
					<div className={style.videoAuthoDate}>2024-4-2</div>
				</div>
			</div>
		</div>
	)
}

export default Video
