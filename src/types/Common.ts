export interface ListResponse<T> {
  resultCode: string
  resultMessage: string
  resultCount: string
  body: T[]
}
