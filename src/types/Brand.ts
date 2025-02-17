export interface Brand {
  code: string
  name: string
  imageUrl?: string
}

export interface BrandResponse {
  brand_code: string
  brand_name: string
  brand_pic?: string
}

export interface BrandDetail {
  descriptionImageUrls: string[]
  logoImageUrl?: string
}

export interface BrandDetailResponse {
  brand_pic: string[]
  thumbnail?: string
}