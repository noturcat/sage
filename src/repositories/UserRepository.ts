import { apiClient } from '@/lib/axios'

class UserRepository {
  async checkAvailability(params: { email: string; username: string }): Promise<{ email_exists?: boolean; username_exists?: boolean }> {
    const res = await apiClient.get(`/auth/user/check`, { params })
    return res.data
  }
}

export const userRepository = new UserRepository()


