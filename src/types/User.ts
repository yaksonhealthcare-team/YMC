import { Gender } from "../utils/gender"

export interface User {
  id: string
  name: string
  username: string
  email: string
  level?: string
  levelName?: string
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
    b_idx: string
    brandName: string
    address: string
  }[]
  gender: "M" | "F"
  birthdate: string
}

export interface UserResponse {
  id: string
  name: string
  level?: string
  level_name?: string
  email: string
  hp: string
  post: string
  addr1: string
  addr2: string
  marketing_yn: string
  points: number
  profileURL?: string
  thirdPartyType: string
  sex: "M" | "F"
  birthdate: string
  brands: {
    b_idx: string
    b_name: string
    addr: string
  }[]
}

export interface UserSignup {
  name: string
  mobileNumber: string
  birthDate: string
  gender: Gender
  di: string
  tokenVersionId: string
  encData: string
  integrityValue: string
  email: string
  password: string
  postCode: string
  address1: string
  address2: string
  profileUrl?: string
  brandCodes: string[]
  referralCode: string
  recom: string
  marketingYn: boolean
}

export interface UpdateUserProfileRequest {
  postalCode: string
  address1: string
  address2: string
  sex?: "M" | "F"
  profileUrl: string
  marketingAgreed: boolean
}

export interface CRMUserResponse {
  id: string
  name: string
  email: string
  hp: string
  birthdate: string
  sex: "M" | "F"
  brands: {
    b_idx: string
    b_name: string
    addr: string
  }[]
}
