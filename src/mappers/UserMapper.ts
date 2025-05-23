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
      point: parseInt(response.points.replace(/,/g, ""), 10) || 0,
      profileURL: response.profileURL || undefined,
      thirdPartyType: response.thirdPartyType,
      gender: response.sex as "M" | "F",
      birthdate: response.birthdate || "",
      brands: response.brands.map((brand) => ({
        b_idx: brand.b_idx,
        brandName: brand.b_name,
        address: brand.addr,
        brandCode: brand.brand_code,
      })),
      memberConnectYn: response.member_connect_yn,
    }
  }

  static toUpdateProfileRequest(dto: UpdateUserProfileRequest) {
    return {
      post: dto.postalCode,
      addr1: dto.address1,
      addr2: dto.address2,
      sex: dto.sex,
      profileURL: dto.profileUrl || "",
      marketing_yn: dto.marketingAgreed ? "Y" : "N",
    }
  }
}
