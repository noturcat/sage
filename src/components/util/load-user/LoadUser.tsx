'use client'

import { useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { authRepository } from '@/repositories/AuthRepository'
import useUserStore, { UserStoreState } from '@/store/UserStore'

const LoadUser = () => {
  const setUser = useUserStore((state: UserStoreState) => state.setUser)
  const setLoading = useUserStore((state: UserStoreState) => state.setLoading)

  useEffect(() => {
    const token = getCookie('userToken') as string | null

    if (token) {
      authRepository.loadCurrentUser()
        .then((user) => {
          if (user) {
            setUser(user)
          } else {
            setUser(null)
          }
        })
        .catch((e) => {
          console.error('Failed to load user:', e)
          setUser(null)
        })
    } else {
      setUser(null)
    }
  }, [setUser, setLoading])

  return <></>
}

export default LoadUser
