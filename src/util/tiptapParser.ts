import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import HardBreak from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'
import { TableKit } from '@tiptap/extension-table'
import type { JSONContent } from '@tiptap/react'
import { parseNodeArray } from '@/util/tiptapNormalize'

const extensions = [
  StarterKit.configure({ link: false, hardBreak: false }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight,
  Superscript,
  Subscript,
  Image.configure({ allowBase64: true }),
  Youtube.configure({ controls: false, nocookie: true }),
  TableKit,
  HardBreak,
  Link,
] as const

// Accept JSONContent[] or stringified JSONContent[]
export function parseTipTapToHTML(content: JSONContent[] | string | null | undefined): string {
  const nodes = parseNodeArray(content)
  if (!nodes.length) return ''
  const html = generateHTML({ type: 'doc', content: nodes }, [...extensions])
  // keep your paragraph whitespace behavior
  return html.replace(/<p>/g, '<p style="white-space: pre-wrap;">')
}