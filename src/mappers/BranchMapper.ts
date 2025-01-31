import {
  BranchDetail,
  BranchDetailResponse,
  BranchesWithCurrentAddress,
  BranchSearchResponse,
  BranchSearchResult,
  BranchBookmarkResponse,
  BranchBookmarkResult,
} from "types/Branch"

export class BranchMapper {
  private static toBrand(name: string): "therapist" | "dalia" | "diet" {
    const trimmed = name.trim()
    if (trimmed.startsWith("약손명가")) return "therapist"
    else if (trimmed.startsWith("달리아")) return "dalia"
    else if (trimmed.startsWith("여리한")) return "diet"
    return "therapist"
  }

  private static toProfile(dto: {
    bs_name_ko: string
    bs_image: string
    profile: string
    bs_grade: string
  }): {
    name: string
    profileImageUrl?: string
    description?: string
    grade: string
  } {
    return {
      name: dto.bs_name_ko,
      profileImageUrl: dto.bs_image.length > 0 ? dto.bs_image : undefined,
      description: dto.profile,
      grade: dto.bs_grade,
    }
  }

  static toEntities(dto: BranchSearchResponse): BranchesWithCurrentAddress {
    return {
      branches: dto.body.result.map((item: BranchSearchResult) => ({
        id: item.b_idx,
        name: item.b_name,
        address: item.b_addr,
        latitude: Number(item.b_lat),
        longitude: Number(item.b_lon),
        canBookToday: item.reserve === "Y",
        distanceInMeters: item.distance,
        isFavorite: item.b_bookmark === "Y",
        brand: this.toBrand(item.b_name),
        brandCode: item.brand_code,
      })),
      address: dto.body.current_addr,
    }
  }

  static toBookmarkEntities(dto: BranchBookmarkResponse): BranchesWithCurrentAddress {
    return {
      branches: dto.body.map((item: BranchBookmarkResult) => ({
        id: item.b_idx,
        name: item.b_name,
        address: item.b_addr || "",
        latitude: 0,
        longitude: 0,
        canBookToday: item.is_reserve === "Y",
        distanceInMeters: item.distance,
        isFavorite: true,
        brand: this.toBrand(item.b_name),
        brandCode: "",
      })),
      address: "",
    }
  }

  static toDetailEntity(dto: BranchDetailResponse): BranchDetail {
    const staffs = dto.staff.map(this.toProfile)
    const directorDTO = dto.staff.find(
      (item) => item.bs_grade === "원장" || item.bs_name_ko === dto.bs_name_ko,
    )
    const director = directorDTO ? this.toProfile(directorDTO) : undefined

    return {
      id: dto.b_idx,
      name: dto.b_name,
      brand: dto.brand_name,
      brandCode: dto.brand_code,
      images: dto.img_lists,
      location: {
        address: dto.location.b_addr,
        latitude: Number(dto.location.b_lat),
        longitude: Number(dto.location.b_lon),
        distance: dto.location.distance,
      },
      phoneNumber: dto.b_tel,
      operatingHours: {
        weekday: {
          start: dto.biz_time.b_biz_stime,
          end: dto.biz_time.b_biz_etime,
        },
        saturday: {
          start: dto.biz_time.saturday.b_sat_stime,
          end: dto.biz_time.saturday.b_sat_etime,
        },
        holiday: {
          start: dto.biz_time.holiday.b_hol_stime,
          end: dto.biz_time.holiday.b_hol_etime,
        },
      },
      director: director,
      staffs: staffs,
      directions: {
        bus: {
          description: dto.directions.bus.b_bus_doc,
          routes: [dto.directions.bus.b_bus_list],
        },
        subway: {
          description: dto.directions.b_subway,
        },
        car: {
          description: dto.directions.b_car,
        },
      },
      notices: [dto.b_notice],
      favoriteCount: Number(dto.b_bookmarks_count),
      availableMembershipCount: Number(dto.membership_count),
    }
  }
}
