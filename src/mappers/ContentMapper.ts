import { Notice, NoticeDetail } from "../types/Content.ts"
import { Event, EventDetail } from "types/Event"

/**
 * API 응답 데이터를 애플리케이션 내부 모델로 변환하는 매퍼 클래스입니다.
 */
export class ContentMapper {
  /**
   * API에서 받은 이벤트 목록 데이터를 Event 객체 배열로 변환합니다.
   * @param dtos - API 응답 이벤트 데이터 배열
   * @returns 변환된 Event 객체 배열
   */
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

  /**
   * API에서 받은 이벤트 상세 데이터를 EventDetail 객체로 변환합니다.
   * @param dto - API 응답 이벤트 상세 데이터
   * @returns 변환된 EventDetail 객체
   */
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

  /**
   * API에서 받은 공지사항 목록 데이터를 Notice 객체 배열로 변환합니다.
   * @param dtos - API 응답 공지사항 데이터 배열
   * @returns 변환된 Notice 객체 배열
   */
  static toNotices(dtos: Notice[]): Notice[] {
    return dtos.map((dto) => ({
      code: dto.code,
      gubun: dto.gubun,
      title: dto.title,
      regDate: dto.regDate,
    }))
  }

  /**
   * API에서 받은 공지사항 상세 데이터를 NoticeDetail 객체로 변환합니다.
   * @param dto - API 응답 공지사항 상세 데이터
   * @returns 변환된 NoticeDetail 객체
   */
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
