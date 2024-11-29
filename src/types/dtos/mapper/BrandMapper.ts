import { BrandDTO } from "../BrandDTO.ts"
import { Brand } from "../../Brand.ts"

export class BrandMapper {
  static toEntity(dto: BrandDTO): Brand {
    return {
      code: dto.brand_code,
      name: dto.brand_name,
      imageUrl: dto.brand_pic,
    }
  }

  static toEntities(dtos: BrandDTO[]): Brand[] {
    return dtos.map(this.toEntity)
  }
}
