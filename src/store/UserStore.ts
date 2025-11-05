import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserType } from '@/types/User.type'

export type UserStoreState = {
	user: UserType | null
	isLoggedIn: boolean
	isLoading: boolean
	setUser: (user: UserType | null) => void
	setLoginState: (loggedIn: boolean) => void
	setLoading: (loading: boolean) => void
	logout: () => void
}

const useUserStore = create<UserStoreState>()(
	persist(
		set => ({
			user: null,
			isLoggedIn: false,
			isLoading: true,

			setUser: user => {
				set({
					user,
					isLoggedIn: !!user,
					isLoading: false,
				})
			},

			setLoginState: loggedIn => set({ isLoggedIn: loggedIn }),

			setLoading: loading => set({ isLoading: loading }),

			logout: () => {
				set({ user: null, isLoggedIn: false, isLoading: false })
			},
		}),
		{
			name: 'justholistics-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useUserStore
