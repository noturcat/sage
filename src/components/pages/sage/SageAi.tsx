'use client'

import { useState, useRef, useEffect } from 'react'
import Textarea from '@/components/atoms/textarea/Textarea'
import { sageAIService } from '@/lib/sage-ai/sageAIService'
import { formatAIResponse } from '@/lib/sage-ai/formatAIResponse'
import style from './SageAi.module.scss'

import type { SearchItem } from '@/components/organisms/global-search/GlobalSearch.types'

type ChatMessage = {
	id: string
	text: string
	isUser: boolean
	sources?: SearchItem[]
}

type QAPair = {
	id: string
	question: ChatMessage
	answer: ChatMessage
}
const SageAi = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [isConfigured, setIsConfigured] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const chatContainerRef = useRef<HTMLDivElement>(null)

	// Convert messages array to Q&A pairs
	const getQAPairs = (): QAPair[] => {
		const pairs: QAPair[] = []
		for (let i = 0; i < messages.length; i += 2) {
			const question = messages[i]
			const answer = messages[i + 1]

			if (question && answer) {
				pairs.push({
					id: `qa-${question.id}`,
					question,
					answer,
				})
			}
		}
		return pairs
	}

	useEffect(() => {
		setIsConfigured(sageAIService.isConfigured())
	}, [])

	const aiMessagesCount = messages.filter(msg => !msg.isUser).length
	useEffect(() => {
		if (aiMessagesCount > 0 && chatContainerRef.current) {
			setTimeout(() => {
				chatContainerRef.current?.scrollTo({
					top: chatContainerRef.current.scrollHeight,
					behavior: 'smooth',
				})
			}, 100)
		}
	}, [aiMessagesCount])

	useEffect(() => {
		if (chatContainerRef.current) {
			setTimeout(() => {
				chatContainerRef.current?.scrollTo({
					top: chatContainerRef.current.scrollHeight,
					behavior: 'smooth',
				})
			}, 50)
		}
	}, [isSearching])

	const handleTextSubmit = async (text: string) => {
		if (!text.trim()) return

		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			text: text.trim(),
			isUser: true,
		}

		setMessages(prev => [...prev, userMessage])
		setIsSearching(true)

		try {
			const response = await sageAIService.generateResponse(text.trim())

			const aiMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				text: response.answer,
				isUser: false,
				sources: response.sources,
			}

			setMessages(prev => [...prev, aiMessage])
		} catch (error) {
			console.error('Error generating AI response:', error)
			const errorMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				text: 'Sorry, I encountered an error while processing your request. Please try again.',
				isUser: false,
			}
			setMessages(prev => [...prev, errorMessage])
		} finally {
			setIsSearching(false)
		}
	}

	return (
		<>
			{messages.length === 0 ? (
				<section className={style.wrapperMain}>
					<div className={style.wrapperMainHeader}>
						<p className={style.wrapperMainHeaderTitle}>Sage AI</p>
						<span className={style.wrapperMainHeaderDescription}>
							Your community&apos;s wise guide to answers.
						</span>
					</div>
					<div className={style.wrapperMainSearches}></div>
					<div className={style.wrapperMainTextarea}>
						<Textarea
							variant="large"
							onSubmit={handleTextSubmit}
							disabled={!isConfigured}
							placeholder={
								isConfigured
									? 'Ask me anything about the community...'
									: 'AI features not configured'
							}
						/>
					</div>
				</section>
			) : (
				<div className={style.wrapperSearch}>
					<div className={style.wrapperSearchContent}>
						<div className={style.wrapperSearchContentAnswer}>
							<div ref={chatContainerRef} className={style.chatMessages}>
								{getQAPairs().map((qaPair, index) => {
									const isLast = index === getQAPairs().length - 1 && !isSearching
									return (
										<div
											key={qaPair.id}
											className={`${style.qaContainer} ${isLast ? style.lastQaContainer : ''}`}
										>
											<div className={`${style.message} ${style.userMessage}`}>
												<div className={style.messageContent}>{qaPair.question.text}</div>
											</div>
											<div className={`${style.message} ${style.aiMessage}`}>
												<div
													className={style.messageContent}
													dangerouslySetInnerHTML={{
														__html: formatAIResponse(qaPair.answer.text),
													}}
												/>
											</div>
										</div>
									)
								})}
								{isSearching && (
									<div className={`${style.qaContainer} ${style.lastQaContainer}`}>
										<div className={`${style.message} ${style.userMessage}`}>
											<div className={style.messageContent}>
												{messages[messages.length - 1]?.text}
											</div>
										</div>
										<div className={`${style.message} ${style.aiMessage}`}>
											<div className={style.messageContent}>
												<div className={style.typingIndicator}>
													<span></span>
													<span></span>
													<span></span>
												</div>
											</div>
										</div>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>
						</div>
						<div className={style.wrapperSearchContentAds}></div>
					</div>
					<div className={style.wrapperSearchTextarea}>
						<Textarea
							variant="large"
							onSubmit={handleTextSubmit}
							disabled={!isConfigured}
							placeholder={
								isConfigured
									? 'Ask me anything about the community...'
									: 'AI features not configured'
							}
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default SageAi
