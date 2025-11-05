'use client'

import { useEffect, ReactNode } from 'react'
import { getCookie } from 'cookies-next'
import { authRepository } from '@/repositories/AuthRepository'
import useUserStore from '@/store/UserStore'

const AuthUser = ({ children }: { children: ReactNode }) => {
	const setUser = useUserStore(state => state.setUser)
	const setLoading = useUserStore(state => state.setLoading)
	const setLoginState = useUserStore(state => state.setLoginState)

	useEffect(() => {
		const token = getCookie('userToken') as string | null
		const controller = new AbortController()

		async function hydrate() {
			try {
				if (token) {
					const user = await authRepository.loadCurrentUser()
					if (user) {
						setUser(user)
						setLoginState(true)
					} else {
						setUser(null)
						setLoginState(false)
					}
				} else {
					setUser(null)
					setLoginState(false)
				}
			} finally {
				setLoading(false)
			}
		}

		hydrate()
		return () => controller.abort()
	}, [setUser, setLoading, setLoginState])

	return <>{children}</>
}

export default AuthUser
