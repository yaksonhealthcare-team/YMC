export interface User {
  username: string
  email: string
  level?: string
  phone: string
  postalCode: string
  address: {
    road: string
    detail: string
  }
  marketingAgreed: boolean
  point: number
  profileURL?: string
  thirdPartyType: string
  brands: {
    brandName: string
    address: string
  }[]
}
