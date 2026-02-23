export enum MembershipStatus {
  ACTIVE = 'T',
  INACTIVE = 'F',
  EXPIRED = 'E'
}

export interface MembershipCategory {
  brand_code: string;
  sc_code: string;
  prior: string;
  sc_name: string;
  sc_pic: string;
}

export interface MembershipOption {
  ss_idx: string;
  ss_count: string;
  ss_price: string;
  original_price: string;
  subscriptionIndex?: string;
}

export interface MembershipItem {
  s_idx: string;
  s_name: string;
  brand_name: string;
  s_time: string;
  s_type: string;
  options: MembershipOption[];
}

export interface MembershipDetail {
  s_name: string;
  brand_name: string | null;
  s_content: string | null;
  s_time: string;
  s_type: string;
  courses: ServiceCourse[];
  pictures: string[];
  options: MembershipOption[];
  serviceName?: string;
}

export interface ServiceCourse {
  sc_idx: string;
  sc_name: string;
  sc_min: string;
  prior: string;
  serviceCourseIndex?: string;
}

export interface BranchInfo {
  b_idx: string;
  b_name: string;
  brandCode: string;
}

export interface MyMembership {
  mp_idx: string;
  status: string;
  service_name: string;
  s_type: string;
  remain_amount: string;
  buy_amount: string;
  pay_date: string;
  expiration_date: string;
  reservations?: MembershipUsageHistory[];
  id?: string;
  branchs?: BranchInfo[];
  brandCode?: string;
}

export interface MyMembershipFilterItem {
  id: MembershipStatus | '-';
  title: string;
}

export const myMembershipFilters: MyMembershipFilterItem[] = [
  {
    id: '-',
    title: '전체'
  },
  {
    id: MembershipStatus.ACTIVE,
    title: '사용가능'
  },
  {
    id: MembershipStatus.INACTIVE,
    title: '사용완료'
  },
  {
    id: MembershipStatus.EXPIRED,
    title: '만료됨'
  }
];

export interface AdditionalManagementOption {
  ss_idx: string;
  ss_count: string;
  ss_price: string;
  original_price?: string;
}

export interface AdditionalManagement {
  s_idx: string;
  s_name: string;
  s_time: string;
  options: AdditionalManagementOption[];
}

export interface MembershipUsageHistory {
  r_idx: string;
  r_date: string;
  ps_name: string;
  visit: string;
}

export interface ServiceCategory {
  sc_idx: string;
  sc_name: string;
  sc_min: string;
  prior: string;
  brandCode?: string;
  serviceCategoryCode?: string;
  serviceCategoryName?: string;
  serviceCategoryImageUrl?: string;
}

export interface ServiceCategoryResponse {
  sc_idx: string;
  sc_name: string;
  sc_min: string;
  prior: string;
  brand_code: string;
  sc_code: string;
  sc_pic: string;
}

export interface ServiceCourseResponse {
  sc_idx: string;
  sc_name: string;
  sc_min: string;
  prior: string;
}

export interface MembershipResponse {
  s_idx: string;
  s_name: string;
  brand_name: string;
  s_time: string;
  s_type: string;
  options: MembershipOption[];
}

export interface MembershipDetailResponse {
  s_name: string;
  brand_name: string | null;
  s_content: string | null;
  s_time: string;
  s_type: string;
  courses: ServiceCourse[];
  pictures: string[];
  options: MembershipOption[];
}

export interface MyMembershipResponse {
  mp_idx: string;
  status: string;
  service_name: string;
  s_type: string;
  remain_amount: string;
  buy_amount: string;
  pay_date: string;
  expiration_date: string;
  reservations?: MembershipUsageHistory[];
}

export interface AdditionalManagementResponse {
  am_idx: string;
  s_name: string;
  s_time: string;
  options: AdditionalManagementOption[];
}

export interface MembershipOptionResponse {
  ss_idx: string;
  ss_count: string;
  ss_price: string;
  original_price: string;
}

export type Membership = MyMembership;
