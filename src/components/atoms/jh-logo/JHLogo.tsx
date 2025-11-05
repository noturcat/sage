import Image from 'next/image'

const JHLogo = ({ size }: { size?: number }) => {
	return (
		<>
			<Image src="/icons/j.svg" alt="JH Logo" width={size || 20} height={size || 20} />
			<Image src="/icons/h.svg" alt="JH Logo" width={size || 20} height={size || 20} />
		</>
	)
}

export default JHLogo
