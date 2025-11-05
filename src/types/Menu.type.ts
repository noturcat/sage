export type HeaderType = {
	id: number
	attributes: {
		name: string
		path: string
		position: boolean
		type: 'header' | 'footer-company' | 'footer-help'
		created_at: Date | string
		updated_at: Date | string
	}
}
