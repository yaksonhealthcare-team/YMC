export interface Event {
  code: string
  title: string
  contents: string
  sdate: string
  edate: string
  files: {
    fileurl: string
  }[]
  status: string
  gubun: string
  seq?: string
  reg_date?: string
  mod_date?: string
  reg_id?: string
  mod_id?: string
}

export interface EventDetail extends Event {
  seq: string
  reg_date: string
  mod_date: string
  reg_id: string
  mod_id: string
}

export type Tab = "ALL" | "ONGOING" | "ENDED"
