import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QueryParamStoreState = {
  sort: string
  filter: string
  setSort: (v: string) => void
  setFilter: (v: string) => void
  reset: () => void
}

export const useQueryParamStore = create<QueryParamStoreState>()(
  persist(
    (set) => ({
      sort: '',
      filter: '',
      setSort: (sort) => set({ sort }),
      setFilter: (filter) => set({ filter }),
      reset: () => set({ sort: '', filter: '' }),
    }),
    {
      name: 'query-param-store',
    },
  ),
)
