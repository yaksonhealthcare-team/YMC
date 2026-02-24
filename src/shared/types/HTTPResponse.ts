type HTTPResponse<T> = {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: T;
};

export type { HTTPResponse };
