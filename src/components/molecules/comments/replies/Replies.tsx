'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'
import Votes from '@/components/molecules/votes/Votes'
import Avatar from '@/components/atoms/avatar/Avatar'
import Divider from '@/components/atoms/divider/Divider'
import Reply from '@/components/molecules/comments/replies/Reply'
import CustomButton from '@/components/atoms/button/CustomButton'
import { useGetNestedReplies } from '@/app/api/replies/queries/nested-replies'
import { useCreateNestedReply } from '@/app/api/replies/mutations/create-nested-reply'
import { useEditReply } from '@/app/api/replies/mutations/edit-reply'
import { useDeleteReply } from '@/app/api/replies/mutations/delete-reply'
import { getTimeElapsed } from '@/util/globalFunction'
import type { ReplyType } from '@/types/Reply'
import { VoteableTypeEnum } from '@/types/Enums'
import { Doc, toDoc, docToArray } from '@/util/tiptapNormalize'
import useUserStore from '@/store/UserStore'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import Dialog from '@/components/atoms/dialog/Dialog'

import style from './Replies.module.scss'

/**
 * **Replies component** for nested comment replies.
 *
 * Manages nested comment replies with a tree-like structure.
 * Features dynamic expansion of replies, truncation detection, and nested reply display.
 *
 * Example:
 * ```tsx
 * <Replies
 *   id={1}
 *   avatar="/images/1.jpg"
 *   author="John Doe"
 *   time="2 minutes ago"
 *   count={1}
 *   votes={10}
 *   content="This is a reply"
 *   depth={1}
 *   nestedReplies={[]}
 * />
 * ```
 *
 * Notes:
 * - Manages nested comment replies with a tree-like structure.
 * - Features dynamic expansion of replies, truncation detection, and nested reply display.
 * - Handles nested reply display with proper indentation and styling.
 * - Supports truncation of long replies and provides a toggle button to expand/collapse the content.
 * - Provides a clear and consistent UI for nested comment replies.
 */

interface RepliesProps {
	replies: ReplyType[]
	isNested?: boolean
	depth?: number
	validationKey?: string
	pending?: boolean
}
function Replies({
	replies,
	isNested = true,
	depth = 0,
	validationKey,
	pending = false,
}: RepliesProps) {
	const [content, setContent] = useState<Doc | null>(null)
	const [showReply, setShowReply] = useState<number | null>(null)
	const [showNestedReply, setShowNestedReply] = useState<Set<number>>(new Set())
	const [editReply, setEditReply] = useState<number | null>(null)
	const [deleteReply, setDeleteReply] = useState<number | null>(null)
	const [isExpanded, setIsExpanded] = useState(false)
	const [needsTruncation, setNeedsTruncation] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)
	const { user } = useUserStore()

	const { mutateAsync: createNestedReply } = useCreateNestedReply()
	const { mutateAsync: editReplyMutation } = useEditReply()
	const { mutateAsync: deleteReplyMutation } = useDeleteReply()
	const { data: nestedReplies, isPending: isNestedRepliesPending } = useGetNestedReplies(
		showNestedReply.size > 0 ? Array.from(showNestedReply)[0] : 0,
		showNestedReply.size > 0
	)

	const handleReply = useCallback(
		(id: number) => {
			setShowReply(prev => (prev === id ? null : id))

			// If showing reply (not edit), add author mention to the editor content
			if (editReply !== id) {
				const reply = replies.find(r => Number(r.id) === id)
				if (reply) {
					const authorName = `${reply.attributes.author.first_name} ${reply.attributes.author.last_name}`
					const mentionContent = toDoc([
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: `@${authorName} `,
									marks: [
										{
											type: 'bold',
										},
									],
								},
								{
									type: 'text',
									text: ' ',
								},
							],
						},
					])
					setContent(mentionContent)
				}
			}
		},
		[editReply, replies]
	)

	const handleNestedReply = (id: number) => {
		setShowNestedReply(prev => {
			const newSet = new Set(prev)
			if (newSet.has(id)) {
				newSet.delete(id)
			} else {
				newSet.add(id)
			}
			return newSet
		})
	}

	const handleToggleExpanded = useCallback(() => {
		setIsExpanded(!isExpanded)
	}, [isExpanded])

	const handleStartEditReply = (replyId: number) => {
		const replyToEdit = replies.find(r => Number(r.id) === replyId)
		if (replyToEdit) {
			setEditReply(replyId)
			setShowReply(replyId)
			setContent(replyToEdit.attributes.reply as unknown as Doc | null)
		}
	}

	const handleCancelEditReply = () => {
		setEditReply(null)
		setShowReply(null)
		setContent(null)
	}

	const handleSaveEditReply = async (replyId: number) => {
		if (!content || !content.content || content.content.length === 0) return
		try {
			await editReplyMutation({
				replyId,
				reply: {
					reply: docToArray(content),
				},
			})
			setEditReply(null)
			setShowReply(null)
			setContent(null)
		} catch (error) {
			console.error('Failed to edit reply:', error)
		}
	}

	const handleCreateNestedReply = async (replyId: number) => {
		if (!content || !content.content || content.content.length === 0) return

		try {
			if (editReply === replyId) {
				await handleSaveEditReply(replyId)
			} else {
				await createNestedReply({
					replyId,
					reply: {
						reply: content.content,
					},
				})
				setContent(null)
				setShowReply(null)
				setShowNestedReply(prev => {
					const newSet = new Set(prev)
					newSet.add(replyId)
					return newSet
				})
			}
		} catch (error) {
			console.error('Failed to create/edit nested reply:', error)
		}
	}

	const handleDeleteReply = async (replyId: number) => {
		try {
			await deleteReplyMutation({ replyId })
			setShowReply(null)
		} catch (error) {
			console.error('Failed to delete reply:', error)
		}
	}

	const handleCopyReply = (replyId: number) => {
		try {
			const replyToCopy = replies.find(r => Number(r.id) === replyId)
			if (replyToCopy) {
				const doc = toDoc(replyToCopy.attributes.reply)
				const htmlContent =
					doc.content
						?.map(node => {
							if (node.type === 'paragraph' && node.content) {
								return node.content.map(textNode => textNode.text || '').join('')
							}
							return ''
						})
						.join('\n') || ''

				navigator.clipboard.writeText(htmlContent)
				console.log('Reply copied to clipboard')
			}
		} catch (error) {
			console.error('Failed to copy reply:', error)
		}
	}

	const handleReportReply = (replyId: number) => {
		console.log('Report reply', replyId)
	}

	useEffect(() => {
		if (contentRef.current) {
			const { scrollHeight, clientHeight } = contentRef.current
			setNeedsTruncation(scrollHeight > clientHeight)
		}
	}, [content])

	return replies.length === 0
		? null
		: replies.map(reply => {
				const replyId = Number(reply.id) || 0
				const authorName =
					`${reply.attributes.author?.first_name ?? ''} ${reply.attributes.author?.last_name ?? ''}`.trim()

				return (
					<div className={style.replies} key={replyId} data-depth={depth}>
						<article className={style.reply}>
							<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={42} />
							<div className={style.card}>
								<div className={style.header}>
									<p className={style.info}>
										<span className={style.name}>{authorName}</span>
										<span className={style.date}>
											{getTimeElapsed(reply.attributes.created_at)}
										</span>
									</p>
									<DropdownMenu>
										<DropdownMenu.Trigger>
											<div className={style.ellipsis}>
												<span className={style.iconEllipsis} />
											</div>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											{user?.id === Number(reply.attributes.author?.id) && (
												<DropdownMenu.Item onClick={() => handleStartEditReply(replyId)}>
													Edit
												</DropdownMenu.Item>
											)}
											{user?.id === Number(reply.attributes.author?.id) && (
												<DropdownMenu.Item>
													<Dialog
														open={deleteReply === replyId}
														onOpenChange={() => setDeleteReply(null)}
													>
														<Dialog.Trigger>Delete</Dialog.Trigger>
														<Dialog.Content>
															<Dialog.Header>
																<Dialog.Title>Delete Reply</Dialog.Title>
															</Dialog.Header>
															<p className={style.deleteMessage}>
																Are you sure you want to delete this reply? This action cannot be
																undone.
															</p>
															<Dialog.Footer>
																<Dialog.Close>
																	<CustomButton variant="outline">Cancel</CustomButton>
																</Dialog.Close>

																<CustomButton
																	variant="danger"
																	onClick={() => handleDeleteReply(replyId)}
																>
																	Delete
																</CustomButton>
															</Dialog.Footer>
														</Dialog.Content>
													</Dialog>
												</DropdownMenu.Item>
											)}
											<DropdownMenu.Item onClick={() => handleCopyReply(replyId)}>
												Copy
											</DropdownMenu.Item>
											<DropdownMenu.Item onClick={() => handleReportReply(replyId)}>
												Report
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu>
								</div>
								<div className={style.contentWrapper}>
									<div
										ref={contentRef}
										className={`${style.content} ${isExpanded ? style.contentExpanded : ''}`}
									>
										<RichTextContent html={reply.attributes.reply} />
									</div>
									{needsTruncation && (
										<CustomButton
											variant="text"
											className={style.toggleButton}
											onClick={handleToggleExpanded}
										>
											{isExpanded ? 'See less' : 'See more'}
										</CustomButton>
									)}
								</div>
								<div className={style.actions}>
									<Votes
										voteableId={replyId}
										voteableType={VoteableTypeEnum.REPLY}
										votes={reply.attributes.votes_score}
										userVote={reply.attributes.user_vote ?? null}
										validationKey={validationKey ?? `replies`}
										pending={pending}
									/>
									{isNested && (
										<button
											className={style.repliesButton}
											onClick={() => handleNestedReply(replyId)}
										>
											<span className={style.iconReply} />
											<span className={style.count}>
												{reply.attributes.children_count || 0} Replies
											</span>
										</button>
									)}
									<button className={style.replyButton} onClick={() => handleReply(replyId)}>
										Reply
									</button>
								</div>
								{showReply === replyId && (
									<div className={style.editReply}>
										<Reply
											content={content}
											onContentChange={incoming => setContent(incoming as Doc | null)}
											onSendReply={() => handleCreateNestedReply(replyId)}
										/>
										{editReply === replyId && (
											<CustomButton
												variant="text"
												size="sm"
												className={style.cancelButton}
												onClick={handleCancelEditReply}
											>
												Cancel Edit
											</CustomButton>
										)}
									</div>
								)}
							</div>
						</article>

						{reply.attributes.children && reply.attributes.children.length === 0 && (
							<Divider extraClass={style.divider} />
						)}
						{showNestedReply.has(replyId) &&
							(isNestedRepliesPending ? (
								<Skeleton className={style.skeleton} />
							) : (
								<Replies
									replies={nestedReplies?.data || []}
									isNested={false}
									depth={depth + 1}
									validationKey="nested-replies"
									pending={isNestedRepliesPending}
								/>
							))}
					</div>
				)
			})
}

export default Replies
