export interface BranchDetailParams {
  b_idx: string;
  nowlat: number;
  nowlon: number;
}
export interface BranchDetailSchema {
  b_idx: string;
  img_lists: {
    cscf_idx: string;
    com_file_url: string;
  }[];
  brand_code: string;
  brand_name: string;
  b_name: string;
  location: BranchDetailLocation;
  b_tel: string;
  b_notice: string;
  is_bookmarked: string;
  staff: BranchDetailStaff[];
  biz_time: BranchDetailBizTime;
  directions: BranchDetailDirections;
  b_bookmarks_count: string;
  membership_count: string;
}
export interface BranchDetailLocation {
  b_biz_stime: string;
  distance: string;
  b_addr: string;
  b_lat: string;
  b_lon: string;
}
export interface BranchDetailStaff {
  bs_name_ko: string;
  bs_image: string;
  profile: string;
  bs_grade: string;
}
export interface BranchDetailBizTime {
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
}
export interface BranchDetailDirections {
  bus: {
    b_bus_doc: string;
    b_bus_list: string;
  };
  b_subway: string;
  b_car: string;
}

export interface BranchesParams {
  mp_idx?: string;
  nowlat?: number;
  nowlon?: number;
  search?: string;
  page?: number;
}
export interface BranchesSchema {
  brand_code: string;
  b_idx: string;
  b_name: string;
  b_addr: string;
  b_lat: string;
  b_lon: string;
  reserve: string;
  distance: string;
  b_bookmark: string;
  branch_pic: string;
}
