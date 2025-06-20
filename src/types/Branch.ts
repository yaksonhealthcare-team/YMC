export interface Branch {
  b_idx: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  canBookToday: boolean;
  distanceInMeters: string | null;
  isFavorite: boolean;
  brandCode: string;
  brand: string;
  b_type?: '전지점' | '지정지점';
  thumbnailUrl?: string;
}

export interface BranchesWithCurrentAddress {
  branches: Branch[];
  address: string;
}

export interface BranchDetail {
  b_idx: string;
  name: string;
  brand: string;
  brandCode: string;
  images: string[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
    distance?: string;
  };
  phoneNumber: string;
  operatingHours: {
    weekday: {
      start: string;
      end: string;
    };
    saturday: {
      start: string;
      end: string;
    };
    sunday?: {
      start: string;
      end: string;
    };
    holiday: {
      start: string;
      end: string;
    };
  };
  director?: Profile;
  staffs: Profile[];
  directions: {
    bus: {
      description: string;
      routes: string[];
    };
    subway: {
      description: string;
    };
    car: {
      description: string;
    };
  };
  notices?: string[];
  favoriteCount: number;
  availableMembershipCount: number;
  isBookmarked?: boolean;
  programs?: {
    name: string;
    duration: string;
    price: number;
    discount?: number;
    scope: 'all' | 'branch_only';
  }[];
}

export interface Profile {
  name: string;
  profileImageUrl?: string;
  description?: string;
  grade: string;
}

export interface BranchFilters {
  page?: number;
  latitude?: number;
  longitude?: number;
  brandCode?: string;
  category?: string;
  search?: string;
  mp_idx?: string;
}

export interface BranchSearchResponse {
  resultCode: string;
  resultMessage: string;
  resultCount: string;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: {
    current_addr: string;
    result: BranchSearchResult[];
  };
}

export interface BranchSearchResult {
  b_idx: string;
  b_name: string;
  b_addr: string;
  b_lat: string;
  b_lon: string;
  reserve: string;
  distance: string;
  b_bookmark: string;
  brand_code: string;
  branch_pic: string;
}

export interface BranchBookmarkResponse {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  total_count: number;
  total_page_count: number;
  current_page: number;
  body: BranchBookmarkResult[];
}

export interface BranchBookmarkResult {
  b_idx: string;
  b_name: string;
  b_addr: string;
  csbms_idx: string;
  distance: string;
  times: string;
  is_reserve: string;
  branch_pic: string;
}

export interface BranchDetailResponse {
  b_idx: string;
  img_lists: {
    com_file_url: string;
  }[];
  brand_code: string;
  brand_name: string;
  b_name: string;
  location: {
    b_biz_stime: string;
    distance: string;
    b_addr: string;
    b_lat: string;
    b_lon: string;
  };
  b_tel: string;
  b_notice: string;
  staff: {
    bs_name_ko: string;
    bs_image: string;
    profile: string;
    bs_grade: string;
  }[];
  bs_name_ko: string;
  bs_image: string;
  biz_time: {
    b_biz_stime: string;
    b_biz_etime: string;
    saturday: {
      b_sat_stime: string;
      b_sat_etime: string;
    };
    sunday: {
      b_sun_stime: string;
      b_sun_etime: string;
    };
    holiday: {
      b_hol_stime: string;
      b_hol_etime: string;
    };
  };
  directions: {
    bus: {
      b_bus_doc: string;
      b_bus_list: string;
    };
    b_subway: string;
    b_car: string;
  };
  b_bookmarks_count: string;
  membership_count: string;
  is_bookmarked: string;
}

export interface BranchCategory {
  code: string;
  title: string;
}

export interface BranchCategoryResponse {
  brand_code: string;
  sc_code: string;
  prior: string;
  sc_name: string;
  sc_pic: string;
}
