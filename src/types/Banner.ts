export interface Banner {
  code: string
  title: string
  link: string
  prior: string
  fileCode: string
  fileUrl: string
}

export interface BannerResponse {
  code: string
  title: string
  link: string
  prior: string
  fileCode: string
  fileurl: string
}

export enum BannerRequestType {
  SLIDE = "S01",
  CARD = "C01",
  RIBBON = "R01",
}
