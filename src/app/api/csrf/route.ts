import { NextResponse } from 'next/server'

export function GET() {
  // simple CSRF token echo (demo only)
  const token = Math.random().toString(36).slice(2)
  const res = NextResponse.json({ token })
  res.headers.set('Set-Cookie', `csrfToken=${token}; Path=/; HttpOnly; SameSite=Lax`)
  return res
}


