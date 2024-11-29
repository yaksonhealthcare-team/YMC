type UserResponseDTO = {
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

export type { UserResponseDTO }
