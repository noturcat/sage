import { apiClient } from '@/lib/axios'
import { CategoryType } from '@/types/Category.type'
import { toSpatieParams } from '@/lib/spatie'

type PaginateParams = {
  page?: number
  perPage?: number
  sortBy?: string
  orderBy?: 'asc' | 'desc'
  [key: string]: unknown
}

class CategoryRepository {
  async paginate(params?: PaginateParams): Promise<{ data: CategoryType[] }> {
    const res = await apiClient.get('/categories', { params: toSpatieParams(params) })
    return res.data
  }

  async show(id: string | number): Promise<{ data: CategoryType }> {
    const res = await apiClient.get(`/categories/${id}`)
    return res.data
  }

  async save(payload: Partial<CategoryType>): Promise<{ data: CategoryType }> {
    const res = await apiClient.post('/categories', payload)
    return res.data
  }

  async update(id: string | number, payload: Partial<CategoryType>): Promise<{ data: CategoryType }> {
    const res = await apiClient.put(`/categories/${id}`, payload)
    return res.data
  }

  async destroy(id: string | number): Promise<{ status: number }> {
    const res = await apiClient.delete(`/categories/${id}`)
    return { status: res.status }
  }
}

export const categoryRepository = new CategoryRepository()


