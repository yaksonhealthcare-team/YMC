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

export interface UserResponse {
  name: string
  level?: string
  email: string
  hp: string
  post: string
  addr1: string
  addr2: string
  marketing_yn: string
  point: number
  profileURL?: string
  thirdPartyType: string
  brands: {
    b_name: string
    addr: string
  }[]
}
