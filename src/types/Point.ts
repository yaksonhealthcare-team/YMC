export interface PointHistory {
  pointType: string;
  title: string;
  description: string;
  date: string;
  point: string;
}

export interface PointHistoryResponse {
  point_type: string;
  doc: string;
  point: string;
  description: string;
  reg_date: string;
}

export interface PointFilters {
  page: number;
}
