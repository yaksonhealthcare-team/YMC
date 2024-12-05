import {
  User,
  UserResponse,
  UserSignup,
  UserSignupRequest,
} from "../types/User.ts"

export class UserMapper {
  static toEntity(dto: UserResponse): User {
    return {
      username: dto.name,
      email: dto.email,
      level: dto.level,
      phone: dto.hp,
      postalCode: dto.post,
      address: {
        road: dto.addr1,
        detail: dto.addr2,
      },
      marketingAgreed: dto.marketing_yn === "Y",
      point: dto.point,
      profileURL: dto.profileURL,
      thirdPartyType: dto.thirdPartyType,
      brands: dto.brands.map((brand) => ({
        brandName: brand.b_name,
        address: brand.addr,
      })),
    }
  }
}

export class UserSignupRequestMapper {
  static fromUserSignup(dto: UserSignup): UserSignupRequest {
    return {
      ...dto,
      token_version_id: dto.tokenVersionId,
      enc_data: dto.encData,
      integrity_value: dto.integrityValue,
      marketing_yn: dto.marketingYn,
    }
  }
}
