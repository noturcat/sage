'use client'
import { useEffect, useRef, useState } from 'react'
import {
	parseReviveTag,
	fetchAdContent,
	parseAdJavaScript,
	ParsedReviveTag,
	debugTitleExtraction,
	testSpecificAdContent,
} from '@/lib/revive/parseReviveTag'
import Image from 'next/image'
import style from './Advertisement.module.scss'

interface AdvertisementProps {
	size?: number
	zoneId?: number
	advertisement: string
	type?: 'default' | 'sage'
}

const Advertisement = ({
	size = 112,
	zoneId = 7,
	advertisement,
	type = 'default',
}: AdvertisementProps) => {
	const adContainerRef = useRef<HTMLDivElement>(null)
	const [parsed, setParsed] = useState<ParsedReviveTag | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadAdvertisement = async () => {
			try {
				setLoading(true)
				setError(null)

				const raw = advertisement
				const zoneIdMatch = raw.match(/zoneid=(\d+)/)
				const rawZoneId = zoneIdMatch ? parseInt(zoneIdMatch[1]) : zoneId
				const adContent = await fetchAdContent(rawZoneId)

				if (!adContent) {
					throw new Error('No advertisement content received')
				}

				debugTitleExtraction(adContent)

				testSpecificAdContent()

				const parsedData = parseAdJavaScript(adContent)
				setParsed(parsedData)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load advertisement')
				const fallbackData = parseReviveTag(advertisement)
				setParsed(fallbackData)
			} finally {
				setLoading(false)
			}
		}

		loadAdvertisement()
	}, [zoneId, advertisement, type])

	const handleAdClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!parsed) return

		const destinationUrl = parsed.destinationDomain
			? `https://${parsed.destinationDomain}`
			: parsed.clickUrl

		if (!destinationUrl || destinationUrl.includes('INSERT_RANDOM_NUMBER_HERE')) {
			e.preventDefault()
			return
		}
	}

	if (loading) {
		return (
			<div
				ref={adContainerRef}
				className={style.advertisement}
				style={{ width: size, height: size }}
			>
				<div className={style.advertisementFallback}>
					<div className={style.loadingText}>Loading Advertisement...</div>
				</div>
			</div>
		)
	}

	if (error) {
		return ''
	}

	if (!parsed) {
		return (
			<div
				ref={adContainerRef}
				className={style.advertisement}
				style={{ width: size, height: size }}
			>
				<div className={style.advertisementFallback}>
					<div className={style.loadingText}>No Advertisement Available</div>
					<div className={style.zoneInfo}>Zone {zoneId}</div>
				</div>
			</div>
		)
	}

	return (
		<div ref={adContainerRef} className={style.advertisement}>
			{type == 'default' ? (
				<a
					href={parsed.destinationDomain ? `https://${parsed.destinationDomain}` : parsed.clickUrl}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleAdClick}
					className={style.advertisement}
				>
					<div className={style.advertisementContent}>
						{parsed.imageUrl ? (
							<Image
								src={parsed.imageUrl}
								alt={parsed.title || 'Advertisement'}
								width={size}
								height={size}
								className={style.advertisementImage}
								onError={e => {
									e.currentTarget.style.display = 'none'
								}}
								priority
							/>
						) : (
							<div className={style.advertisementFallback}>
								<div className={style.loadingText}>No Image Available</div>
								<div className={style.zoneInfo}>Zone {parsed.zoneId}</div>
							</div>
						)}
					</div>

					<div className={style.title}>
						<div className={style.titleText}>{parsed.title}</div>
						<div className={style.titleDestination}>{parsed.destinationDomain}</div>
					</div>
				</a>
			) : (
				<a
					href={parsed.destinationDomain ? `https://${parsed.destinationDomain}` : parsed.clickUrl}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleAdClick}
					className={style.advertisement}
				>
					<div className={style.title}>
						<div className={style.titleText}>{parsed.title}</div>
						{parsed.description && (
							<div className={style.titleDescription}>{parsed.description}</div>
						)}
					</div>
				</a>
			)}
		</div>
	)
}

export default Advertisement
