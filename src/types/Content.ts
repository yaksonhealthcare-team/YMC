export type EventStatus = "ALL" | "ING" | "END" | "TBD"

export interface Event {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  status: EventStatus
  files: {
    fileCode: string
    fileurl: string
  }[]
}

export interface EventDetail {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  contents: string
  files: {
    fileCode: string
    fileurl: string
  }[]
}

export interface Notice {
  code: string
  gubun: string
  title: string
  regDate: string
}

export interface NoticeDetail {
  code: string
  gubun: string
  title: string
  regDate: string
  contents: string
  files: Array<{
    fileCode: string
    fileurl: string
  }>
}
