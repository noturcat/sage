import { apiClient } from '@/lib/axios'

class LegalPagesRepository {
  async show(type: string): Promise<{ data: { content: string } }> {
    const res = await apiClient.get(`/legal-pages`, { params: { type } })
    return res.data
  }
}

export const legalPagesRepository = new LegalPagesRepository()


