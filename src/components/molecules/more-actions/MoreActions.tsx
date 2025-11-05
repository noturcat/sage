'use client'

import React, { useState, useRef, useEffect } from 'react'
import style from './MoreActions.module.scss'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import type { ActionItem, MoreActionsProps, ApiResponse, ApiError } from './MoreActions.type'

const MoreActions = ({
	actions,
	onActionClick,
	onActionSuccess,
	onActionError,
	isOpen = false,
	onClose,
	trigger,
}: MoreActionsProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(isOpen)
	const [loading, setLoading] = useState<string | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setIsDropdownOpen(isOpen)
	}, [isOpen])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false)
				onClose?.()
			}
		}

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDropdownOpen, onClose])

	const handleApiCall = async (action: ActionItem): Promise<ApiResponse> => {
		if (!action.apiMethod) {
			throw new Error('No API method provided for action')
		}

		try {
			// Use the repository method based on the action
			const result = await action.apiMethod()
			return result
		} catch (error) {
			console.error('API call failed:', error)
			const apiError: ApiError = {
				message: error instanceof Error ? error.message : 'Unknown error occurred',
				status:
					error instanceof Error && 'status' in error
						? (error as unknown as ApiError).status
						: undefined,
				code:
					error instanceof Error && 'code' in error
						? (error as unknown as ApiError).code
						: undefined,
			}
			throw apiError
		}
	}

	const handleActionClick = async (action: ActionItem) => {
		setLoading(action.id)

		try {
			// Call the API if endpoint is provided
			const result = await handleApiCall(action)

			// Call success callback
			onActionSuccess?.(action.id, result)

			// Call the general action click callback
			onActionClick?.(action.id, result)
		} catch (error) {
			// Cast error to ApiError since we know it's the type we throw
			const apiError = error as ApiError

			// Call error callback
			onActionError?.(action.id, apiError)

			// Still call the general action click callback for error handling
			onActionClick?.(action.id, apiError)
		} finally {
			setLoading(null)
			setIsDropdownOpen(false)
			onClose?.()
		}
	}

	const handleTriggerClick = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	return (
		<div className={style.moreActionsWrapper} ref={dropdownRef}>
			{trigger ? <div onClick={handleTriggerClick}>{trigger}</div> : ''}

			{isDropdownOpen && (
				<div className={style.dropdown}>
					{actions &&
						actions.map(action => (
							<button
								key={action.id}
								className={`${style.dropdownItem} ${action.danger ? style.danger : ''} ${loading === action.id ? style.loading : ''}`}
								onClick={() => handleActionClick(action)}
								disabled={loading === action.id}
							>
								{action.icon && (
									<span className={style.icon}>
										<ButtonIcon
											icon={action.icon}
											alt=""
											size={16}
											variant="text"
											styleType="icon"
											iconPos="append"
											extraClass={style.extra}
										/>
									</span>
								)}
								<span className={style.label}>
									{loading === action.id ? 'Loading...' : action.label}
								</span>
							</button>
						))}
				</div>
			)}
		</div>
	)
}

export default MoreActions
