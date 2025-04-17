import { Notice, NoticeDetail } from "../types/Content.ts"
import { Event, EventDetail } from "types/Event"

export class ContentMapper {
  static toEvents(dtos: Event[]): Event[] {
    return dtos.map((dto) => ({
      code: dto.code,
      title: dto.title,
      contents: dto.contents || "",
      sdate: dto.sdate,
      edate: dto.edate,
      files: dto.files || [],
      gubun: dto.gubun,
    }))
  }

  static toEventDetail(dto: EventDetail): EventDetail {
    return {
      code: dto.code,
      title: dto.title,
      contents: dto.contents || "",
      sdate: dto.sdate,
      edate: dto.edate,
      files: dto.files || [],
      gubun: dto.gubun,
    }
  }

  static toNotices(dtos: Notice[]): Notice[] {
    return dtos.map((dto) => ({
      code: dto.code,
      gubun: dto.gubun,
      title: dto.title,
      regDate: dto.regDate,
    }))
  }

  static toNoticeDetail(dto: NoticeDetail): NoticeDetail {
    return {
      code: dto.code,
      gubun: dto.gubun,
      title: dto.title,
      regDate: dto.regDate,
      contents: dto.contents,
      files: dto.files || [],
    }
  }
}
