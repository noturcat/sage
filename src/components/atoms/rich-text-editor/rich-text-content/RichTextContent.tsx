import type { JSONContent } from '@tiptap/react'
import { parseTipTapToHTML } from '@/util/tiptapParser'
import style from './RichTextContent.module.scss'

type RichTextContentProps = {
	html: JSONContent[] | string | null | undefined
}

function RichTextContent({ html }: RichTextContentProps) {
	return (
		<div className={style.richText} dangerouslySetInnerHTML={{ __html: parseTipTapToHTML(html) }} />
	)
}

export default RichTextContent
