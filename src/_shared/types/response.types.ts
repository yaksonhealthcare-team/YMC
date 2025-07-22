/**
 * API Response 타입
 */
export interface ApiResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: string;
  body: T;
}

/**
 * 리스트 Response 타입
 */
export interface ListResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: T[];
}

/**
 * Result Response 타입
 */
export interface ResultResponse<T> extends Omit<ListResponse<T>, 'body'> {
  body: {
    current_addr: string;
    result: T[];
  };
}
