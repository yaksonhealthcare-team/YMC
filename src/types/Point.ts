type PointHistory = {
  pointType: string
  title: string // TODO: 백엔드에서 타입 알려주시면 반영하기 (지금은 online_payment_point만 있음)
  description: string
  date: string
  point: string
}

export type { PointHistory }
