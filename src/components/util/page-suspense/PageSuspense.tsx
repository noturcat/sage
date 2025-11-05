'use client'

import { Suspense } from 'react'

export default function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      {children}
    </Suspense>
  )
}


