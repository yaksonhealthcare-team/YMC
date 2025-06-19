export interface ListResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: string;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: T[];
}
