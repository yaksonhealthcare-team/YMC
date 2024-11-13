import { UserResponseDTO } from "../UserDTO.ts"
import { User } from "../../User.ts"

export class UserMapper {
  static toEntity(dto: UserResponseDTO): User {
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
      brands: dto.brands,
    }
  }
}
