export type RichTextContent = {
	// Headings (from HeadingSelect)
	h1?: string
	h2?: string
	h3?: string
	h4?: string
	h5?: string
	h6?: string

	// Lists (from ListSelect)
	ul?: string[]
	ol?: string[]
	li?: string[]

	// Block elements
	blockquote?: string
	codeBlock?: string

	// Text formatting
	strong?: string // bold
	em?: string // italic
	u?: string // underline
	s?: string // strike
	code?: string // inline code
	mark?: string // highlight

	// Links
	a?: string | { href: string; text: string }

	// Text alignment (these might be stored differently)
	p?: string | string[]

	// Content insertion
	hr?: string // horizontal rule
	table?: Record<string, unknown> // table structure
	img?: string // image
	youtube?: string // youtube embed

	// Allow for any other properties
	[key: string]: string | string[] | Record<string, unknown> | undefined
}
