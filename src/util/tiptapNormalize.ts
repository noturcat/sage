import type { JSONContent } from '@tiptap/react'

export type Doc = { type: 'doc'; content?: JSONContent[] }
export type NodeArray = JSONContent[]

// Parse stringified JSONContent[] from BE
export function parseNodeArray(input: unknown): NodeArray {
	if (Array.isArray(input)) return input as NodeArray
	if (typeof input === 'string') {
		try {
			const parsed = JSON.parse(input)
			return Array.isArray(parsed) ? (parsed as NodeArray) : []
		} catch {
			return []
		}
	}
	return []
}

export function toDoc(input: unknown): Doc {
	// If input is already a document object, return it
	if (
		input &&
		typeof input === 'object' &&
		'type' in input &&
		input.type === 'doc' &&
		'content' in input
	) {
		return input as Doc
	}
	return { type: 'doc', content: parseNodeArray(input) }
}

// Unwrap for BE (send the same array shape back)
export function docToArray(doc: Doc | null | undefined): NodeArray {
	return doc?.content ?? []
}
