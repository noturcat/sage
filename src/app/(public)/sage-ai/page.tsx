"use client"

import { useState } from 'react'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

export default function SageAiPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        const text = input.trim()
        if (!text) return
        const userMsg: Message = { id: String(Date.now()), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/api/sage-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchResults: [], searchQuery: text }),
            })
            const data = await res.json()
            const answer: string = data.answer || 'No answer returned.'
            setMessages(prev => [...prev, { id: String(Date.now()+1), role: 'assistant', content: answer }])
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { id: String(Date.now()+2), role: 'assistant', content: 'Error processing your request.' },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ marginBottom: 16 }}>Sage AI</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {messages.map(m => (
                    <div key={m.id} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        background: m.role === 'user' ? '#e8f5e9' : '#f5f5f5',
                        color: '#111',
                        padding: '10px 12px',
                        borderRadius: 8,
                        maxWidth: '100%'
                    }}>
                        {m.content}
                    </div>
                ))}
                {loading && <div style={{ color: '#666' }}>Thinking…</div>}
            </div>
            <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything…"
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
                />
                <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: 6 }}>
                    Send
                </button>
            </form>
        </main>
    )
}
