export type GetParams = {
  url: string
  tags?: string[]
  cache?: RequestCache
  cookies?: {
    name: string
    value: string
  }[]
}

export type PostParams = {
  url: string
  data: object
}