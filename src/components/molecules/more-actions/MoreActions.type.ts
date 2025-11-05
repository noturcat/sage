export type ApiResponse = {
	success: boolean
	message?: string
	data?: unknown
}

export type ApiError = {
	message: string
	status?: number
	code?: string
}

export type ActionItem = {
	id: string
	label: string
	icon?: string
	danger?: boolean
	apiMethod?: () => Promise<ApiResponse>
}

export type MoreActionsProps = {
	actions: ActionItem[]
	onActionClick?: (actionId: string, result?: ApiResponse | ApiError) => void
	onActionSuccess?: (actionId: string, result: ApiResponse) => void
	onActionError?: (actionId: string, error: ApiError) => void
	isOpen?: boolean
	onClose?: () => void
	trigger?: React.ReactNode
}
