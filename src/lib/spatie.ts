export type SpatieInputParams = {
  page?: number
  perPage?: number
  sortBy?: string
  orderBy?: 'asc' | 'desc'
  [key: string]: unknown
}

export function toSpatieParams(params?: SpatieInputParams): Record<string, unknown> {
  const spatieParams: Record<string, unknown> = {}
  if (!params) return spatieParams

  const { page, perPage, sortBy, orderBy, ...filters } = params

  if (typeof page !== 'undefined') spatieParams['page[number]'] = page
  if (typeof perPage !== 'undefined') spatieParams['page[size]'] = perPage
  if (sortBy) spatieParams.sort = orderBy === 'desc' ? `-${sortBy}` : sortBy

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      spatieParams[`filter[${key}]`] = value
    }
  })

  return spatieParams
}



