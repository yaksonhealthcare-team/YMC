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

export interface UserSignup {
  name: string
  mobileNumber: string
  birthDate: string
  gender: string
  di: string
  tokenVersionId: string
  encData: string
  integrityValue: string
  email: string
  password: string
  postCode: string
  address1: string
  address2: string
  profileImage: File | null
  brandCodes: string[]
  referralCode: string
  recom: string
  marketingYn: boolean
}

export interface UserSignupRequest {
  name: string
  mobileno: string
  birthdate: string
  gender: string
  di: string
  token_version_id: string
  enc_data: string
  integrity_value: string
  email: string
  password: string
  addr1: string
  addr2: string
  fileToUpload: File | null
  recom: string
  marketing_yn: boolean
}

export interface UserUpdateRequest {
  post: string
  addr1: string
  addr2: string
  marketing_yn: string
  // TODO: API Request에 gender 필드 추가되면 여기도 추가할 것
}
