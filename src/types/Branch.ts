export interface Branch {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  canBookToday: boolean
  distanceInMeters: string | null
  isFavorite: boolean
  brandCode: string
  brand: "therapist" | "dalia" | "diet"
}

export interface BranchesWithCurrentAddress {
  branches: Branch[]
  address: string
}

export interface BranchDetail {
  id: string
  name: string
  brand: string
  brandCode: string
  images: string[]
  location: {
    address: string
    latitude: number
    longitude: number
    distance?: string
  }
  phoneNumber: string
  operatingHours: {
    weekday: {
      start: string
      end: string
    }
    saturday: {
      start: string
      end: string
    }
    holiday: {
      start: string
      end: string
    }
  }
  director?: Profile
  staffs: Profile[]
  directions: {
    bus: {
      description: string
      routes: string[]
    }
    subway: {
      description: string
    }
    car: {
      description: string
    }
  }
  notices?: string[]
  favoriteCount: number
  availableMembershipCount: number
  isBookmarked?: boolean
  programs?: {
    name: string
    duration: string
    price: number
    discount?: number
    scope: "all" | "branch_only"
  }[]
}

export interface Profile {
  name: string
  profileImageUrl?: string
  description?: string
}

export interface BranchFilters {
  page?: number
  latitude?: number
  longitude?: number
  brandCode?: string
  category?: string
  search?: string
}

export interface BranchResponse {
  b_idx: string
  b_name: string
  addr: string
  lat: string
  lon: string
  b_tel: string
  b_owner: string
  brand_code: string
  brand_name: string
}

export interface BranchDetailResponse {
  b_idx: string
  img_lists: string[]
  brand_code: string
  brand_name: string
  b_name: string
  location: {
    b_biz_stime: string
    distance: string
    b_addr: string
    b_lat: string
    b_lon: string
  }
  b_tel: string
  b_notice: string
  staff: {
    bs_name_ko: string
    bs_image: string
    profile: string
    bs_grade: string
  }[]
  bs_name_ko: string
  bs_image: string
  biz_time: {
    b_biz_stime: string
    b_biz_etime: string
    saturday: {
      b_sat_stime: string
      b_sat_etime: string
    }
    sunday: {
      b_mon_stime: string
      b_mon_etime: string
    }
    holiday: {
      b_hol_stime: string
      b_hol_etime: string
    }
  }
  directions: {
    bus: {
      b_bus_doc: string
      b_bus_list: string
    }
    b_subway: string
    b_car: string
  }
  b_bookmarks_count: string
  membership_count: string
}
