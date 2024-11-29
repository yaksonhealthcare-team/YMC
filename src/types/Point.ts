export interface PointHistory {
  pointType: string
  title: string // TODO: 백엔드에서 타입 알려주시면 반영하기 (지금은 online_payment_point만 있음)
  description: string
  date: string
  point: string
}

export interface PointHistoryResponse {
  point_type: string
  doc: string
  point: string
  description: string
  reg_date: string
}

export interface PointFilters {
  page: number
}
