import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import CustomButton from '@/components/atoms/button/CustomButton'
import Dialog from '@/components/atoms/dialog/Dialog'
import { Input } from '@/components/atoms/input/Input'
import ChatHeader from '@/components/molecules/messages/ChatHeader'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import { useSearchUsers, useGetUsersSuggestions } from '@/app/api/users/queries/user-search'
import { useCreateChatRoom } from '@/app/api/messages/mutations/create-chat-room'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './NoChatSelected.module.scss'

interface NoChatSelectedProps {
	buttonLabel?: string
	type?: 'chat' | 'request'
	dialogContent?: ReactNode
	dialogTitle?: string
	onClick?: () => void
}

function NoChatSelected({
	buttonLabel = '',
	type = 'chat',
	dialogTitle = '',
	onClick = () => {},
}: NoChatSelectedProps) {
	const router = useRouter()
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null)
	const debouncedSearchQuery = useDebounce(searchQuery, 300)
	const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchQuery, 10)
	const { data: suggestions, isLoading: isLoadingSuggestions } = useGetUsersSuggestions(4, {
		enabled: open && searchQuery.trim().length === 0,
	})

	const handleChatRoomCreated = (chatRoomId: string) => {
		const filterType = pathname.split('/')[2] || 'all'
		router.push(`/messages/${filterType}/${chatRoomId}`)
		setOpen(false)
		setSearchQuery('')
		setSelectedSuggestionId(null)
		onClick()
	}

	const { mutate: createChatRoom, isPending: isCreatingChatRoom } =
		useCreateChatRoom(handleChatRoomCreated)

	const handleDialogOpenChange = (isOpen: boolean) => {
		setOpen(isOpen)
		if (!isOpen) {
			setSearchQuery('')
			setSelectedSuggestionId(null)
		}
	}

	const isSearchingUsers = searchQuery.trim().length > 0
	const displayResults = isSearchingUsers ? searchResults || [] : suggestions || []
	const showSuggestions = !isSearchingUsers
	const canCreateChat = selectedSuggestionId !== null && !isCreatingChatRoom

	const handleCreateChat = () => {
		if (!selectedSuggestionId) return

		const selectedUser = displayResults.find(user => user.id === selectedSuggestionId)
		if (!selectedUser) return

		const userId = parseInt(selectedUser.id, 10)
		if (isNaN(userId)) {
			console.error('Invalid user ID')
			return
		}

		createChatRoom({
			chatRoom: {
				user_ids: [userId],
			},
		})
	}

	const message = type === 'chat' ? 'No chat selected' : 'Manage requests'
	const description =
		type === 'chat' ? (
			'Send a message to start a chat'
		) : (
			<div className={styles.descriptionContainer}>
				<span>Please make sure to review the requests carefully</span>
				<br />
				<span>before communicating</span>
			</div>
		)
	return (
		<div className={styles.noChatSelectedContainer}>
			<span className={`${type === 'chat' ? styles.chat : styles.request}`} />
			<span className={styles.noChatSelectedText}>{message}</span>
			<span className={styles.noChatSelectedDescription}>{description}</span>
			{buttonLabel != '' && (
				<Dialog open={open} onOpenChange={handleDialogOpenChange}>
					<Dialog.Trigger>
						<CustomButton
							radius="full"
							className={styles.newChatButton}
							onClick={() => setOpen(true)}
						>
							{buttonLabel}
						</CustomButton>
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title className={styles.dialogTitleContainer}>
								<span className={styles.dialogTitle}>{dialogTitle}</span>
							</Dialog.Title>
						</Dialog.Header>

						{/* Search Input */}
						<Input
							id="search-dm"
							name="search-dm"
							type="search"
							placeholder="Search name or username"
							radius="full"
							className={styles.searchInput}
							rightIcon={<span className={styles.iconCreate} />}
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>

						{/* Search Results or Suggestions */}
						<section className={styles.resultsSection}>
							{isSearchingUsers && (
								<div>
									<span className={styles.suggestionTitle}>
										{isSearching
											? 'Searching...'
											: displayResults.length > 0
												? 'Search Results:'
												: 'No results found'}
									</span>
								</div>
							)}
							{showSuggestions && (
								<div>
									<span className={styles.suggestionTitle}>
										{isLoadingSuggestions ? 'Loading suggestions...' : 'Suggested:'}
									</span>
								</div>
							)}
							<div
								className={`${styles.suggestionListContainer} ${
									isSearchingUsers ? styles.scrollable : ''
								}`}
							>
								{(isSearching && isSearchingUsers) || (isLoadingSuggestions && showSuggestions) ? (
									<>
										{Array.from({ length: 4 }).map((_, index) => (
											<div key={index} className={styles.suggestionItemSkeleton}>
												<Skeleton radius="full" className={styles.skeletonAvatar} />
												<div className={styles.skeletonTextContainer}>
													<Skeleton radius="md" className={styles.skeletonName} />
													<Skeleton radius="md" className={styles.skeletonUsername} />
												</div>
											</div>
										))}
									</>
								) : (
									displayResults.map(user => {
										const fullName =
											`${user.attributes.first_name} ${user.attributes.last_name}`.trim()
										const avatarUrl =
											user.attributes.avatar?.url || '/images/avatar-placeholder.png'
										return (
											<div
												className={`${styles.suggestionItem} ${
													selectedSuggestionId === user.id ? styles.active : ''
												}`}
												onClick={() => setSelectedSuggestionId(user.id)}
												key={user.id}
											>
												<ChatHeader
													compact
													hideDetailsButton
													avatar={avatarUrl}
													fullName={fullName}
													username={user.attributes.username}
												/>
											</div>
										)
									})
								)}
							</div>
						</section>

						<Dialog.Footer>
							<CustomButton
								radius="full"
								className={styles.createNewChatButton}
								onClick={handleCreateChat}
								disabled={!canCreateChat}
							>
								{isCreatingChatRoom ? 'Creating...' : 'Chat'}
							</CustomButton>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog>
			)}
		</div>
	)
}

export default NoChatSelected
