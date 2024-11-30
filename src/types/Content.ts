type EventStatus = "ALL" | "ING" | "END" | "TBD"

type Event = {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  status: EventStatus
}

type EventDetail = {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  contents: string
  files: string | null
}

type Notice = {
  code: string
  gubun: string
  title: string
  regDate: string
}

type NoticeDetail = {
  code: string
  gubun: string
  title: string
  regDate: string
  contents: string
  files: string | null
}

export type { EventStatus, Event, EventDetail, Notice, NoticeDetail }
