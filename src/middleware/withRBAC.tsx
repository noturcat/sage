"use client"
import { ReactNode } from 'react'
import useUserStore from '@/store/UserStore'

type Role = 'guest' | 'user' | 'business'

type RBACProps = {
  allow: Role[]
  fallback?: ReactNode
  children: ReactNode
}

export default function WithRBAC({ allow, fallback = null, children }: RBACProps) {
  const user = useUserStore((s) => s.user)

  const role: Role = user?.permissions?.some((p) => p.name === 'business_provider' && p.value)
    ? 'business'
    : user
      ? 'user'
      : 'guest'

  if (!allow.includes(role)) return <>{fallback}</>
  return <>{children}</>
}


