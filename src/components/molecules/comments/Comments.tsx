'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Replies from '@/components/molecules/comments/replies/Replies'
import RichTextContent from '@/components/atoms/rich-text-editor/rich-text-content/RichTextContent'
import Votes from '@/components/molecules/votes/Votes'
import Avatar from '@/components/atoms/avatar/Avatar'
import Comment from '@/components/molecules/comments/Comment'
import CustomButton from '@/components/atoms/button/CustomButton'
import Skeleton from '@/components/atoms/skeleton/Skeleton'
import Reply from '@/components/molecules/comments/replies/Reply'
import DropdownMenu from '@/components/atoms/dropdown-menu/DropdownMenu'
import Dialog from '@/components/atoms/dialog/Dialog'
import { useCreateReply } from '@/app/api/replies/mutations/create-reply'
import { useGetMultipleReplies } from '@/app/api/replies/queries/replies'
import { useCreateComment } from '@/app/api/comments/mutations/create-comment'
import { useEditComment } from '@/app/api/comments/mutations/edit-comment'
import { useDeleteComment } from '@/app/api/comments/mutations/delete-comment'
import { getTimeElapsed } from '@/util/globalFunction'
import type { CommentType } from '@/types/Comment.type'
import { CommentableTypeEnum, VoteableTypeEnum } from '@/types/Enums'
import { docToArray, Doc, toDoc } from '@/util/tiptapNormalize'
import useUserStore from '@/store/UserStore'

import style from './Comments.module.scss'

/**
 * **Comments component** for displaying comments.
 *
 * Displays comments with a user avatar, name, time, content, and replies.
 *
 * Example:
 * ```tsx
 * <Comments
 *   comments={comments}
 *   placeholder="Add a comment"
 *   reply="This is a reply"
 *   comment="This is a comment"
 *   onReply={onReply}
 *   onComment={onComment}
 * />
 * ```
 *
 * Notes:
 * - Displays comments with a user avatar, name, time, content, and replies.
 * - Provides a clear and consistent UI for displaying comments and nested comment replies.
 * - Supports nested comment replies with a tree-like structure.
 * - Supports rich text editing with TipTap.
 */

interface CommentsProps {
	comments: CommentType[]
	commentableId?: number
	commentableType?: string
	isLoading?: boolean
}

function Comments({ comments, commentableId, commentableType, isLoading = false }: CommentsProps) {
	const [comment, setComment] = useState<Doc | null>(null)
	const [reply, setReply] = useState<Doc | null>(null)
	const [editComment, setEditComment] = useState<number | null>(null)
	const [showComment, setShowComment] = useState<number | null>(null)
	const [showReplies, setShowReplies] = useState<Set<number>>(new Set())
	const [deleteComment, setDeleteComment] = useState<number | null>(null)
	const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())
	const [needsTruncation, setNeedsTruncation] = useState<Map<number, boolean>>(new Map())
	const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map())
	const { user } = useUserStore()

	useEffect(() => {
		contentRefs.current.forEach((element, id) => {
			const { scrollHeight, clientHeight } = element
			const needsTruncationValue = scrollHeight > clientHeight
			setNeedsTruncation(prev => {
				const newMap = new Map(prev)
				newMap.set(id, needsTruncationValue)
				return newMap
			})
		})
	}, [])

	const { mutateAsync: createComment } = useCreateComment()
	const { mutateAsync: createReply } = useCreateReply()
	const { mutateAsync: editCommentReply } = useEditComment()
	const { mutateAsync: deleteCommentReply } = useDeleteComment()

	const repliesQueries = useGetMultipleReplies(Array.from(showReplies))

	const handleShowComment = (id: number) => {
		setShowComment(prev => (prev === id ? null : id))

		if (editComment !== id) {
			const comment = comments.find(c => Number(c.id) === id)
			if (comment) {
				const authorName = `${comment.attributes.author.first_name} ${comment.attributes.author.last_name}`
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
				setReply(mentionContent)
			}
		}
	}

	const handleShowReplies = (id: number) => {
		setShowReplies(prev => {
			const newSet = new Set(prev)
			if (newSet.has(id)) {
				newSet.delete(id)
			} else {
				newSet.add(id)
			}
			return newSet
		})
	}

	const handleToggleExpanded = (id: number) => {
		setExpandedComments(prev => {
			const newSet = new Set(prev)
			if (newSet.has(id)) {
				newSet.delete(id)
			} else {
				newSet.add(id)
			}
			return newSet
		})
	}

	const handleCreateComment = useCallback(async () => {
		if (!comment?.content || comment.content.length === 0) {
			return
		}
		try {
			await createComment({
				content: {
					commentable_id: commentableId ?? 0,
					commentable_type: commentableType as CommentableTypeEnum,
					comment: docToArray(comment),
				},
			})
			setComment(null)
		} catch (error) {
			console.error('Failed to create comment:', error)
		}
	}, [comment, createComment, commentableId, commentableType])

	const setContentRef = (id: number, element: HTMLDivElement | null) => {
		if (element) {
			contentRefs.current.set(id, element)
		}
	}

	const handleCreateReply = useCallback(
		async (commentId: number) => {
			if (!reply?.content) return

			try {
				await createReply({
					commentId,
					reply: {
						reply: docToArray(reply),
					},
				})
				setReply(null)
				setShowComment(null)
				setShowReplies(prev => {
					const newSet = new Set(prev)
					newSet.add(commentId)
					return newSet
				})
			} catch (error) {
				console.error('Failed to create reply:', error)
			}
		},
		[reply, createReply]
	)

	const handleCopyComment = (commentId: number) => {
		try {
			const commentToCopy = comments.find(c => Number(c.id) === commentId)
			if (commentToCopy) {
				const doc = toDoc(commentToCopy.attributes.comment)
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
				console.log('Comment copied to clipboard')
			}
		} catch (error) {
			console.error('Failed to copy comment:', error)
		}
	}

	const handleReportComment = (commentId: number) => {
		console.log('Report comment', commentId)
	}

	const handleStartEditComment = (commentId: number) => {
		const commentToEdit = comments.find(c => Number(c.id) === commentId)
		if (commentToEdit) {
			setEditComment(commentId)
			setShowComment(commentId)
			setReply(commentToEdit.attributes.comment as unknown as Doc | null)
		}
	}

	const handleCancelEditComment = () => {
		setEditComment(null)
		setShowComment(null)
		setReply(null)
	}

	const handleSaveEditComment = async (commentId: number) => {
		if (!reply || !reply.content || reply.content.length === 0) return
		try {
			await editCommentReply({
				commentId,
				comment: docToArray(reply),
			})
			setEditComment(null)
			setShowComment(null)
			setReply(null)
		} catch (error) {
			console.error('Failed to edit comment:', error)
		}
	}

	const handleDeleteComment = useCallback(
		async (commentId: number) => {
			try {
				await deleteCommentReply({ commentId })
				setShowComment(null)
				setShowReplies(new Set())
			} catch (error) {
				console.error('Failed to delete comment:', error)
			}
		},
		[deleteCommentReply]
	)

	return (
		<>
			<Comment
				content={comment}
				onContentChange={incoming => setComment(incoming as Doc | null)}
				onSendComment={handleCreateComment}
				author={user ?? undefined}
			/>

			{isLoading ? (
				<Skeleton className={style.commentsSkeleton} />
			) : comments.length === 0 ? (
				<div className={style.noComments}>
					<div className={style.iconChat} />
					<p className={style.message}>No comments made yet. Be the first to submit a comment.</p>
				</div>
			) : (
				comments.map((comment, index) => {
					const commentId = Number(comment?.id) || 0
					const isExpanded = expandedComments.has(commentId)
					const needsTruncationValue = needsTruncation.get(commentId) || false

					return (
						<div key={commentId || index} className={style.comments} data-depth="0">
							<article className={style.comment}>
								<Avatar src={'/images/avatar-placeholder.png'} alt="Avatar" size={42} />
								<div className={style.card}>
									<div className={style.header}>
										<p className={style.info}>
											<span className={style.name}>
												{comment?.attributes?.author?.first_name}{' '}
												{comment?.attributes?.author?.last_name}
											</span>
											<span className={style.date}>
												{getTimeElapsed(comment?.attributes?.created_at || '')}
											</span>
										</p>
										<DropdownMenu>
											<DropdownMenu.Trigger>
												<div className={style.ellipsis}>
													<span className={style.iconEllipsis} />
												</div>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												{user?.id === Number(comment?.attributes?.author?.id) && (
													<DropdownMenu.Item onClick={() => handleStartEditComment(commentId)}>
														Edit
													</DropdownMenu.Item>
												)}
												{user?.id === Number(comment?.attributes?.author?.id) && (
													<DropdownMenu.Item>
														<Dialog
															open={deleteComment === commentId}
															onOpenChange={() => setDeleteComment(null)}
														>
															<Dialog.Trigger>Delete</Dialog.Trigger>
															<Dialog.Content>
																<Dialog.Header>
																	<Dialog.Title>Delete Comment</Dialog.Title>
																</Dialog.Header>
																<p className={style.deleteMessage}>
																	Are you sure you want to delete this comment? This action cannot
																	be undone.
																</p>
																<Dialog.Footer>
																	<Dialog.Close>
																		<CustomButton variant="outline">Cancel</CustomButton>
																	</Dialog.Close>

																	<CustomButton
																		variant="danger"
																		onClick={() => handleDeleteComment(commentId)}
																	>
																		Delete
																	</CustomButton>
																</Dialog.Footer>
															</Dialog.Content>
														</Dialog>
													</DropdownMenu.Item>
												)}
												<DropdownMenu.Item onClick={() => handleCopyComment(commentId)}>
													Copy
												</DropdownMenu.Item>
												<DropdownMenu.Item onClick={() => handleReportComment(commentId)}>
													Report
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu>
									</div>
									<div className={style.contentWrapper}>
										<div
											ref={el => setContentRef(commentId, el)}
											className={`${style.content} ${isExpanded ? style.contentExpanded : ''}`}
										>
											<RichTextContent html={comment?.attributes?.comment} />
										</div>
										{needsTruncationValue && (
											<CustomButton
												variant="text"
												className={style.toggleButton}
												onClick={() => handleToggleExpanded(commentId)}
											>
												{isExpanded ? 'See less' : 'See more'}
											</CustomButton>
										)}
									</div>
									<div className={style.actions}>
										<Votes
											voteableId={commentId}
											voteableType={VoteableTypeEnum.COMMENT}
											votes={comment?.attributes?.votes_score ?? 0}
											validationKey="comments"
											userVote={comment?.attributes?.user_vote ?? null}
											pending={isLoading}
										/>
										<button className={style.replies} onClick={() => handleShowReplies(commentId)}>
											<span className={style.iconReply} />
											<span className={style.count}>
												{comment?.attributes?.replies_count || 0} Replies
											</span>
										</button>
										<button className={style.reply} onClick={() => handleShowComment(commentId)}>
											Reply
										</button>
									</div>
									{showComment === commentId && (
										<div className={style.editComment}>
											<Reply
												content={reply}
												onContentChange={incoming => setReply(incoming as Doc | null)}
												onSendReply={() => {
													if (editComment === commentId) {
														handleSaveEditComment(commentId)
													} else {
														handleCreateReply(commentId)
													}
												}}
											/>
											{editComment === commentId && (
												<CustomButton
													variant="text"
													size="sm"
													className={style.cancelButton}
													onClick={handleCancelEditComment}
												>
													Cancel Edit
												</CustomButton>
											)}
										</div>
									)}
								</div>
							</article>

							{showReplies.has(commentId) &&
								(() => {
									// Find the query result for this specific comment
									const queryIndex = Array.from(showReplies).indexOf(commentId)
									const repliesQuery = repliesQueries[queryIndex]

									return repliesQuery ? (
										repliesQuery.isPending ? (
											<div className={style.repliesContainer} data-depth="1">
												<Skeleton className={style.skeleton} />
											</div>
										) : (
											<Replies
												replies={repliesQuery.data?.data || []}
												depth={1}
												pending={repliesQuery.isPending}
											/>
										)
									) : null
								})()}
						</div>
					)
				})
			)}
		</>
	)
}

export default Comments
