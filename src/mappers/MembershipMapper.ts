import {
  AdditionalManagement,
  AdditionalManagementResponse,
  MembershipDetail,
  MembershipDetailResponse,
  MembershipOption,
  MembershipOptionResponse,
  MembershipResponse,
  MyMembership,
  MyMembershipResponse,
  ServiceCategory,
  ServiceCategoryResponse,
  ServiceCourse,
  ServiceCourseResponse
} from '@/types/Membership';

export const toServiceCategory = (dto: ServiceCategoryResponse): ServiceCategory => {
  return {
    sc_idx: dto.sc_idx,
    sc_name: dto.sc_name,
    sc_min: dto.sc_min,
    prior: dto.prior,
    brandCode: dto.brand_code,
    serviceCategoryCode: dto.sc_code,
    serviceCategoryName: dto.sc_name,
    serviceCategoryImageUrl: dto.sc_pic
  };
};

export const toServiceCourse = (dto: ServiceCourseResponse): ServiceCourse => {
  return {
    sc_idx: dto.sc_idx,
    sc_name: dto.sc_name,
    sc_min: dto.sc_min,
    prior: dto.prior
  };
};

export const toMembershipOption = (dto: MembershipOption): MembershipOption => {
  return {
    ss_idx: dto.ss_idx,
    ss_count: dto.ss_count,
    ss_price: dto.ss_price,
    original_price: dto.original_price
  };
};

export const toMyMembership = (dto: MyMembershipResponse): MyMembership => {
  return {
    mp_idx: dto.mp_idx,
    status: dto.status,
    service_name: dto.service_name,
    s_type: dto.s_type,
    remain_amount: dto.remain_amount,
    buy_amount: dto.buy_amount,
    pay_date: dto.pay_date,
    expiration_date: dto.expiration_date,
    reservations: dto.reservations
  };
};

export const toMembershipDetail = (dto: MembershipDetailResponse): MembershipDetail => {
  return {
    s_name: dto.s_name,
    brand_name: dto.brand_name || '',
    s_content: dto.s_content,
    s_time: dto.s_time,
    s_type: dto.s_type,
    courses: dto.courses,
    pictures: dto.pictures,
    options: dto.options
  };
};

export const toAdditionalManagement = (dto: AdditionalManagementResponse): AdditionalManagement => {
  return {
    s_idx: dto.am_idx,
    s_name: dto.s_name,
    s_time: dto.s_time,
    options: dto.options
  };
};

export class ServiceCategoryMapper {
  static toEntity(dto: ServiceCategoryResponse): ServiceCategory {
    return toServiceCategory(dto);
  }

  static toEntities(dtos: ServiceCategoryResponse[]): ServiceCategory[] {
    return dtos.map(this.toEntity);
  }
}

export class ServiceCourseMapper {
  static toEntity(dto: ServiceCourseResponse): ServiceCourse {
    return toServiceCourse(dto);
  }

  static toEntities(dtos: ServiceCourseResponse[]): ServiceCourse[] {
    return dtos.map(this.toEntity);
  }
}

export class MembershipOptionMapper {
  static toEntity(dto: MembershipOptionResponse): MembershipOption {
    return toMembershipOption(dto);
  }

  static toEntities(dtos: MembershipOptionResponse[]): MembershipOption[] {
    return dtos.map(this.toEntity);
  }
}

export class MembershipMapper {
  static toEntity(dto: MembershipResponse): MyMembership {
    return {
      mp_idx: dto.s_idx,
      service_name: dto.s_name,
      s_type: dto.s_type,
      status: 'T',
      remain_amount: '0',
      buy_amount: '0',
      pay_date: '',
      expiration_date: ''
    };
  }

  static toEntities(dtos: MembershipResponse[]): MyMembership[] {
    return dtos.map(this.toEntity);
  }
}

export class MembershipDetailMapper {
  static toEntity(dto: MembershipDetailResponse): MembershipDetail {
    return toMembershipDetail(dto);
  }
}

export class MyMembershipMapper {
  static toEntity(dto: MyMembershipResponse): MyMembership {
    return toMyMembership(dto);
  }

  static toEntities(dtos: MyMembershipResponse[]): MyMembership[] {
    return dtos.map(this.toEntity);
  }
}

export class AdditionalManagementMapper {
  static toEntity(dto: AdditionalManagementResponse): AdditionalManagement {
    return toAdditionalManagement(dto);
  }

  static toEntities(dtos: AdditionalManagementResponse[]): AdditionalManagement[] {
    return dtos.map(this.toEntity);
  }
}
