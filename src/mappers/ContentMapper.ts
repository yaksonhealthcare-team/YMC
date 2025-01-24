import { Notice, NoticeDetail } from "../types/Content.ts"
import { Event, EventDetail } from "types/Event"

export class ContentMapper {
  static toEvents(dtos: any[]): Event[] {
    return dtos.map((dto) => ({
      code: dto.code,
      title: dto.title,
      contents: dto.contents || "",
      sdate: dto.sdate,
      edate: dto.edate,
      files: dto.files || [],
      status: dto.status || "",
      gubun: dto.gubun,
      seq: dto.seq,
      reg_date: dto.reg_date,
      mod_date: dto.mod_date,
      reg_id: dto.reg_id,
      mod_id: dto.mod_id,
    }))
  }

  static toEventDetail(dto: any): EventDetail {
    return {
      code: dto.code,
      title: dto.title,
      contents: dto.contents || "",
      sdate: dto.sdate,
      edate: dto.edate,
      files: dto.files || [],
      status: dto.status || "",
      gubun: dto.gubun,
      seq: dto.seq || "",
      reg_date: dto.reg_date || "",
      mod_date: dto.mod_date || "",
      reg_id: dto.reg_id || "",
      mod_id: dto.mod_id || "",
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
      files: dto.files,
    }
  }
}
