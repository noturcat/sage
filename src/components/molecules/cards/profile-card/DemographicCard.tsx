import Link from 'next/link'
import Divider from '@/components/atoms/divider/Divider'
import style from './DemographicCard.module.scss'

/**
 * **Demographic card** displaying demographic information.
 *
 * Displays demographic information with a header and content.
 * Features responsive design with consistent spacing and typography.
 *
 * Example:
 * ```tsx
 * <DemographicCard
 *   bio="pretty not pretty 🦋"
 *   demographic={demographicData}
 *   interests={interestsData}
 * />
 * ```
 *
 * Notes:
 * - Displays demographic information with a header and content.
 * - Features responsive design with consistent spacing and typography.
 * - Accessible markup with proper semantic HTML elements.
 */

interface Interests {
	id: number
	name: string
}

export interface Demographic {
	bio: string
	address1: string
	address2: string
	gender: string
	website: string
	birthday: string
	interests: Interests[]
}

interface DemographicCardProps {
	demographic: Demographic
}

export default function DemographicCard({ demographic }: DemographicCardProps) {
	return (
		<main className={style.wrapper}>
			<article className={style.card}>
				<h5>Introduction</h5>
				<p className={style.bio}>{demographic.bio}</p>
				<Divider />
				<div className={style.address}>
					<div className={style.label}>
						<span className={style.iconAddress} />
						<p>Address</p>
					</div>
					<div className={style.data}>
						<p>{demographic.address1}</p>
						{demographic.address2 && <p>{demographic.address2}</p>}
					</div>
				</div>
				<div className={style.gender}>
					<div className={style.label}>
						<span className={style.iconGender} />
						<p>Gender</p>
					</div>
					<p className={style.data}>{demographic.gender}</p>
				</div>
				<div className={style.website}>
					<div className={style.label}>
						<span className={style.iconWebsite} />
						<p>Website</p>
					</div>
					<Link
						href={demographic.website}
						target="_blank"
						rel="noopener noreferrer"
						className={style.data}
					>
						<abbr title={`go to ${demographic.website} website`}>{demographic.website}</abbr>
					</Link>
				</div>
				<div className={style.birthday}>
					<div className={style.label}>
						<span className={style.iconBirthday} />
						<p>Birthday</p>
					</div>
					<p className={style.data}>{demographic.birthday}</p>
				</div>
				<Divider />
				<div className={style.interests}>
					<div className={style.label}>
						<span className={style.iconInterests} />
						<p>Interests</p>
					</div>
					<div className={style.data}>
						{demographic.interests.map(interest => (
							<p key={interest.id} className={style.interest}>
								{interest.name}
							</p>
						))}
					</div>
				</div>
			</article>
		</main>
	)
}
