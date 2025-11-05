import { Metadata } from 'next'
import { Suspense } from 'react'
import DirectoryPage from '@/components/pages/directory/DirectoryPage'

// import { Metadata, ResolvingMetadata } from 'next'

// export async function generateMetadata(
//   { params }: { params: { alias: string[]; } },
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const defaultImage = '/just-holistics.png'
//   const metaTitle = 'Business Directory'
//   const metaUrl = `${process.env.NEXT_PUBLIC_API_URL}/directory`
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

// Single default export above

export const metadata: Metadata = {
	title: 'Directories | Just Holistics',
	description:
		'Directories from the Just Holistics community.',
}

const Directories = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DirectoryPage />
		</Suspense>
	)
}

export default Directories
