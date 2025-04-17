import { Notice, NoticeDetail } from "../types/Content.ts"
import { Event, EventDetail } from "types/Event"

export class ContentMapper {
  static toEvents(dtos: Record<string, unknown>[]): Event[] {
    return dtos.map((dto) => ({
      code: dto.code as string,
      title: dto.title as string,
      contents: (dto.contents as string) || "",
      sdate: dto.sdate as string,
      edate: dto.edate as string,
      files: (dto.files as []) || [],
      status: (dto.status as string) || "",
      gubun: dto.gubun as string,
    }))
  }

  static toEventDetail(dto: Record<string, unknown>): EventDetail {
    return {
      code: dto.code as string,
      title: dto.title as string,
      contents: (dto.contents as string) || "",
      sdate: dto.sdate as string,
      edate: dto.edate as string,
      files: (dto.files as []) || [],
      gubun: dto.gubun as string,
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

  static toNoticeDetail(dto: Record<string, unknown>): NoticeDetail {
    return {
      code: dto.code as string,
      gubun: dto.gubun as string,
      title: dto.title as string,
      regDate: dto.regDate as string,
      contents: dto.contents as string,
      files: (dto.files as []) || [],
    }
  }
}
