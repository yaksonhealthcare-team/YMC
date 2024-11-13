type HTTPResponse<T> = {
  resultCode: string
  resultMessage: string
  resultCount: number
  total_count?: number
  body: T
}

export type { HTTPResponse }
