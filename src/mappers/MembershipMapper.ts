import {
  Membership,
  MembershipDetail,
  MembershipDetailResponse,
  MembershipOption,
  MembershipOptionResponse,
  MembershipResponse,
  ServiceCategory,
  ServiceCategoryResponse,
  ServiceCourse,
  ServiceCourseResponse,
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

export class ServiceCourseMapper {
  static toEntity(dto: ServiceCourseResponse): ServiceCourse {
    return {
      serviceCourseIndex: dto.sc_idx,
      serviceCourseName: dto.sc_name,
      serviceCourseMinutes: dto.sc_min,
      priority: dto.prior,
    }
  }

  static toEntities(dtos: ServiceCourseResponse[]): ServiceCourse[] {
    return dtos.map(this.toEntity)
  }
}

export class MembershipOptionMapper {
  static toEntity(dto: MembershipOptionResponse): MembershipOption {
    return {
      subscriptionIndex: dto.ss_idx,
      subscriptionCount: dto.ss_count,
      subscriptionOriginalPrice: dto.original_price,
      subscriptionPrice: dto.ss_price,
    }
  }

  static toEntities(dtos: MembershipOptionResponse[]): MembershipOption[] {
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
      options: MembershipOptionMapper.toEntities(dto.options),
    }
  }

  static toEntities(dtos: MembershipResponse[]): Membership[] {
    return dtos.map(this.toEntity)
  }
}

export class MembershipDetailMapper {
  static toEntity(dto: MembershipDetailResponse): MembershipDetail {
    return {
      serviceName: dto.s_name,
      brandName: dto.brand_name || "",
      serviceContent: dto.s_content || "",
      serviceTime: dto.s_time,
      serviceType: dto.s_type,
      courses: ServiceCourseMapper.toEntities(dto.courses),
      pictures: dto.pictures,
      options: MembershipOptionMapper.toEntities(dto.options),
    }
  }
}
