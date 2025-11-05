import { apiClient } from '@/lib/axios'
import { LoginType, RegisterType, ResendOtpType, VerifyOtpType } from '@/types/Auth.type'

export class AuthRepository {
	async register(data: RegisterType) {
		const res = await apiClient.post('/auth/register', data)
		return { status: res.status, json: res.data.data }
	}

	async login(data: LoginType) {
		const res = await apiClient.post('/auth/login', data)
		return { status: res.status, json: res.data, user: res.data?.user }
	}

	async verifyOtp(data: VerifyOtpType) {
		const res = await apiClient.post('/auth/otp/verify', data)
		return { status: res.status, json: res.data, user: res.data?.user }
	}

	async resendOtp(data: ResendOtpType) {
		const res = await apiClient.post('/auth/otp/resend', data)
		return { status: res.status, json: res.data }
	}

	async loadCurrentUser() {
		const res = await apiClient.get('/auth/profile', {
			headers: { 'Cache-Control': 'no-cache' },
		})
		// const res = await apiClient.get('/auth/profile', {
		// 	headers: { 'Cache-Control': 'no-cache' },
		// })
		return res.data
	}

	async logout() {
		const res = await apiClient.post('/auth/logout')
		return res.status
	}

	async forgotPassword(email: string) {
		const res = await apiClient.post('/auth/forgot-password', email)
		return { status: res.status, json: res.data }
	}
}

export const authRepository = new AuthRepository()
