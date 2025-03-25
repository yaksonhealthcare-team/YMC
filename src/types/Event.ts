export interface Event {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  contents?: string
  files: {
    fileCode: string
    fileurl: string
  }[]
}

export interface EventDetail extends Event {
  contents: string
}

export type Tab = "ALL" | "ING" | "END" | "TBD"
