export interface Banner {
  code: string
  title: string
  link: string
  prior: string
  fileCode: string
  fileUrl: string
  startDate?: string
  endDate?: string
  isVisible?: boolean
}

export interface BannerResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  gubun: string
  use: string
  body: {
    code: string
    title: string
    link: string
    prior: string
    fileCode: string
    fileurl: string
    sdate: string
    edate: string
  }[]
}

export enum BannerRequestType {
  SLIDE = "S01",
  CARD = "C01",
  RIBBON = "R01",
}
