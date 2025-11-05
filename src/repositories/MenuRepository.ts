import { apiClient } from '@/lib/axios'
import { HeaderType } from '@/types/Menu.type'
import { toSpatieParams } from '@/lib/spatie'

type PaginateParams = {
  page?: number
  perPage?: number
  sortBy?: string
  orderBy?: 'asc' | 'desc'
	type: string
  [key: string]: unknown
}

class MenuRepository {
  async paginate(params?: PaginateParams): Promise<{ data: HeaderType[] }> {
		const res = await apiClient.get('menus', { params: toSpatieParams(params) })
    return res.data
  }
}

export const menuRepository = new MenuRepository()


