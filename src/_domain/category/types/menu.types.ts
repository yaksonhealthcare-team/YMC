export interface ConsultMenuParams {
  /**
   * 지점 ID
   */
  b_idx: string;

  /**
   * 카테고리 코드
   */
  sc_code?: string;

  /**
   * 페이지 숫자
   */
  page?: number;

  /**
   * 검색어
   */
  search?: string;
}
export interface ConsultMenuSchema {
  sc_name: string;
  s_name: string;
  s_time: string;
  ss_idx: string;
  ss_count: string;
  ss_price: string;
}
