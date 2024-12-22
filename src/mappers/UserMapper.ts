import {
  User,
  UserResponse,
  UserSignup,
  UserSignupRequest,
  UpdateUserProfileRequest,
} from "../types/User.ts"

export class UserMapper {
  static toEntity(response: UserResponse): User {
    return {
      id: response.id,
      name: response.name,
      username: response.name,
      email: response.email,
      level: response.level,
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
        id: brand.b_idx,
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

export class UserSignupRequestMapper {
  static fromUserSignup(dto: UserSignup): UserSignupRequest {
    return {
      ...dto,
      mobileno: dto.mobileNumber,
      birthdate: dto.birthDate,
      addr1: dto.address1,
      addr2: dto.address2,
      fileToUpload: dto.profileImage,
      token_version_id: dto.tokenVersionId,
      enc_data: dto.encData,
      integrity_value: dto.integrityValue,
      marketing_yn: dto.marketingYn,
    }
  }
}
