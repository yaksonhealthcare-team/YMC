export interface Brand {
  code: string
  name: string
  imageUrl?: string
  description?: string
  thumbnail?: {
    filename: string
    fileurl: string
  }
  pictures?: {
    filename: string
    fileurl: string
  }[]
  seq?: string
}

export interface BrandResponse {
  brand_code: string
  brand_name: string
  brand_pic?: string
  description?: string
  thumbnail?: {
    filename: string
    fileurl: string
  }
  files?: {
    filename: string
    fileurl: string
  }[]
}

export interface BrandDetailResponse extends BrandResponse {
  csb_idx: string
  seq: string
  thumbnail_idx?: string
  pictures_idx?: string[]
}
