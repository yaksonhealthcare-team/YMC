type BranchDTO = {
  current_addr: string
  result: {
    b_idx: string
    b_name: string
    b_addr: string
    b_lat: string
    b_lon: string
    reserve: string
    distance: string
    b_bookmark: string
  }[]
}

type BranchDetailDTO = {
  b_idx: string
  img_lists: string[]
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

export type { BranchDTO, BranchDetailDTO }
