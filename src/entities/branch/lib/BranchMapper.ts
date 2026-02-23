import {
  BranchBookmarkResponse,
  BranchBookmarkResult,
  BranchCategory,
  BranchCategoryResponse,
  BranchDetail,
  BranchDetailResponse,
  BranchesWithCurrentAddress,
  BranchSearchResponse,
  BranchSearchResult
} from '@/entities/branch/model/Branch';

export class BranchMapper {
  private static toBrand(name: string): 'therapist' | 'dalia' | 'diet' {
    const trimmed = name.trim();
    if (trimmed.startsWith('약손명가')) return 'therapist';
    else if (trimmed.startsWith('달리아')) return 'dalia';
    else if (trimmed.startsWith('여리한')) return 'diet';
    return 'therapist';
  }

  private static toProfile(dto: { bs_name_ko: string; bs_image: string; profile: string; bs_grade: string }): {
    name: string;
    profileImageUrl?: string;
    description?: string;
    grade: string;
  } {
    return {
      name: dto.bs_name_ko,
      profileImageUrl: dto.bs_image.length > 0 ? dto.bs_image : undefined,
      description: dto.profile,
      grade: dto.bs_grade
    };
  }

  static toEntities(dto: BranchSearchResponse): BranchesWithCurrentAddress {
    return {
      branches: dto.body.result.map((item: BranchSearchResult) => ({
        b_idx: item.b_idx,
        name: item.b_name,
        address: item.b_addr,
        latitude: Number(item.b_lat),
        longitude: Number(item.b_lon),
        canBookToday: item.reserve === 'Y',
        distanceInMeters: item.distance,
        isFavorite: item.b_bookmark === 'Y',
        brand: this.toBrand(item.b_name),
        brandCode: item.brand_code,
        thumbnailUrl: item.branch_pic
      })),
      address: dto.body.current_addr
    };
  }

  static toBookmarkEntities(dto: BranchBookmarkResponse): BranchesWithCurrentAddress {
    return {
      branches: dto.body.map((item: BranchBookmarkResult) => ({
        b_idx: item.b_idx,
        name: item.b_name,
        address: item.b_addr || '',
        latitude: 0,
        longitude: 0,
        canBookToday: item.is_reserve === 'Y',
        distanceInMeters: item.distance,
        isFavorite: true,
        brand: this.toBrand(item.b_name),
        brandCode: '',
        thumbnailUrl: item.branch_pic
      })),
      address: ''
    };
  }

  static toDetailEntity(dto: BranchDetailResponse): BranchDetail {
    const staffs = dto.staff.map(this.toProfile);
    const directorDTO = dto.staff.find((item) => item.bs_grade === '원장' || item.bs_name_ko === dto.bs_name_ko);
    const director = directorDTO ? this.toProfile(directorDTO) : undefined;

    return {
      b_idx: dto.b_idx,
      name: dto.b_name,
      brand: dto.brand_name,
      brandCode: dto.brand_code,
      images: dto.img_lists.flatMap((item) => item.com_file_url),
      location: {
        address: dto.location.b_addr,
        latitude: Number(dto.location.b_lat),
        longitude: Number(dto.location.b_lon),
        distance: dto.location.distance
      },
      phoneNumber: dto.b_tel,
      operatingHours: {
        weekday: {
          start: dto.biz_time.b_biz_stime,
          end: dto.biz_time.b_biz_etime
        },
        saturday: {
          start: dto.biz_time.saturday.b_sat_stime,
          end: dto.biz_time.saturday.b_sat_etime
        },
        sunday: {
          start: dto.biz_time.sunday.b_sun_stime,
          end: dto.biz_time.sunday.b_sun_etime
        },
        holiday: {
          start: dto.biz_time.holiday.b_hol_stime,
          end: dto.biz_time.holiday.b_hol_etime
        }
      },
      director: director,
      staffs: staffs,
      directions: {
        bus: {
          description: dto.directions.bus.b_bus_doc,
          routes: [dto.directions.bus.b_bus_list]
        },
        subway: {
          description: dto.directions.b_subway
        },
        car: {
          description: dto.directions.b_car
        }
      },
      notices: [dto.b_notice],
      favoriteCount: Number(dto.b_bookmarks_count),
      availableMembershipCount: Number(dto.membership_count),
      isBookmarked: dto.is_bookmarked === 'Y'
    };
  }

  static toCategoryEntities(dto: BranchCategoryResponse[], currentBrandCode?: string): BranchCategory[] {
    // 유효한 카테고리만 필터링 (sc_code가 비어있지 않은 항목)
    const validCategories = dto.filter((category) => category.sc_code !== '');

    // 필터링 및 변환
    const filteredCategories = currentBrandCode
      ? validCategories.filter((category) => category.brand_code === currentBrandCode)
      : validCategories;

    // 중복 제거를 위한 Map 사용
    const uniqueCategories = new Map<string, BranchCategory>();

    // 카테고리 변환
    filteredCategories.forEach((category) => {
      // 이미 추가된 같은 코드의 카테고리가 없는 경우에만 추가
      if (!uniqueCategories.has(category.sc_code)) {
        uniqueCategories.set(category.sc_code, {
          code: category.sc_code,
          title: category.sc_name
        });
      }
    });

    // Map을 배열로 변환
    const result = Array.from(uniqueCategories.values());

    return result;
  }
}
