type HTTPResponse<T> = {
  resultCode: string
  resultMessage: string
  resultCount: number
  total_page_count?: string // TODO: 백엔드에서 string => number 로 수정해주시면 변경할 것
  total_count?: number
  current_page?: string // TODO: 백엔드에서 string => number 로 수정해주시면 변경할 것
  body: T
}

export type { HTTPResponse }
