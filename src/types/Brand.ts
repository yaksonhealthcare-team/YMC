export interface Brand {
  code: string;
  name: string;
  imageUrl?: string;
  displayYn: boolean;
  csbIdx: string;
  prior: number;
}

export interface BrandResponse {
  brand_code: string;
  brand_name: string;
  brand_pic?: string;
  brand_display_yn: string;
  csb_idx: string;
  prior: number;
}

export interface BrandDetail {
  descriptionImageUrls: string[];
  logoImageUrl?: string;
}

export interface BrandDetailResponse {
  brand_pic: string[];
  thumbnail?: string;
}
