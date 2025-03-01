import { UpdateUserProfileRequest, User, UserResponse } from "../types/User.ts"

export class UserMapper {
  static toEntity(response: UserResponse): User {
    return {
      id: response.id,
      name: response.name,
      username: response.name,
      email: response.email,
      level: response.level,
      levelName: response.level_name,
      phone: response.hp,
      postalCode: response.post,
      address: {
        road: response.addr1,
        detail: response.addr2,
      },
      marketingAgreed: response.marketing_yn === "Y",
      point: response.point,
      profileURL: response.profileURL,
      thirdPartyType: response.thirdPartyType,
      gender: response.sex as "M" | "F",
      brands: response.brands.map((brand) => ({
        b_idx: brand.b_idx,
        brandName: brand.b_name,
        address: brand.addr,
      })),
    }
  }

  static toUpdateProfileRequest(dto: UpdateUserProfileRequest) {
    return {
      post: dto.postalCode,
      addr1: dto.address1,
      addr2: dto.address2,
      sex: dto.sex,
      profileURL: dto.profileUrl,
      marketing_yn: dto.marketingAgreed ? "Y" : "N",
    }
  }
}
