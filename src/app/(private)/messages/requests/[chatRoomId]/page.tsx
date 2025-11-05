'use client'
import { redirect, useParams } from 'next/navigation'

function AllMessageChatRoom() {
	const { chatRoomId } = useParams()

	if (chatRoomId) redirect(`/messages/requests/${chatRoomId}/pending`)

	return null
}

export default AllMessageChatRoom
