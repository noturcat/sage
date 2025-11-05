// import { Metadata, ResolvingMetadata } from 'next'
import DiscoverPage from '@/components/pages/discover/DiscoverPage'

// export async function generateMetadata(
//   { params }: { params: { alias: string[]; } },
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const defaultImage = '/just-holistics.png'
//   const metaTitle = 'Discover'
//   const metaUrl = `${process.env.NEXT_PUBLIC_API_URL}/discover`
//   const metaDesc = ''
//   const metaImage = defaultImage

//   let metaImageBaseUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}`)

//   if (metaImage == defaultImage) {
//     metaImageBaseUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}`)
//   }

//   const metadata: Metadata = {
//     metadataBase: new URL(metaImageBaseUrl),
//     title: `${metaTitle} | Just Holistics`,
//     description: metaDesc,
//     alternates: {
//       canonical: `${process.env.NEXT_PUBLIC_APP_URL}/`,
//     },
//   }

//   metadata.openGraph = {
//     url: metaUrl,
//     title: metaTitle,
//     description: metaDesc,
//     images: [metaImage],
//   }

//   metadata.twitter = {
//     title: metaTitle,
//     description: metaDesc,
//     images: [metaImage],
//   }

//   return metadata
// }

const Discover = () => {
	return (
		<>
			<DiscoverPage />
		</>
	)
}

export default Discover
