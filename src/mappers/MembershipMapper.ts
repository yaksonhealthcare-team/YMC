import {
  Membership,
  MembershipResponse,
  ServiceCategory,
  ServiceCategoryResponse,
} from "types/Membership"

export class ServiceCategoryMapper {
  static toEntity(dto: ServiceCategoryResponse): ServiceCategory {
    return {
      brandCode: dto.brand_code,
      serviceCategoryCode: dto.sc_code,
      serviceCategoryName: dto.sc_name,
      serviceCategoryImageUrl: dto.sc_pic,
      priorirty: dto.prior,
    }
  }

  static toEntities(dtos: ServiceCategoryResponse[]): ServiceCategory[] {
    return dtos.map(this.toEntity)
  }
}

export class MembershipMapper {
  static toEntity(dto: MembershipResponse): Membership {
    return {
      serviceIndex: dto.s_idx,
      serviceName: dto.s_name,
      brandName: dto.brand_name,
      serviceTime: dto.s_time,
      serviceType: dto.s_type,
      options: dto.options.map((option) => ({
        subscriptionIndex: option.ss_idx,
        subscriptionCount: option.ss_count,
        subscriptionOriginalPrice: option.original_price,
        subscriptionPrice: option.ss_price,
      })),
    }
  }

  static toEntities(dtos: MembershipResponse[]): Membership[] {
    return dtos.map(this.toEntity)
  }
}
