import { PointHistory, PointHistoryResponse } from '@/types/Point';

export class PointMapper {
  static toHistoryTitle(doc: string) {
    switch (doc) {
      case 'signup_point':
        return '회원가입 포인트';
      case 'consultation_point':
        return '문진 작성 포인트';
      case 'survey_point':
        return '만족도 작성 포인트';
      case 'offline_payment__point':
        return '오프라인 결제 포인트 ';
      case 'online_payment_point':
        return '온라인 결제 포인트';
      case 'visit_point':
        return '상담 방문 완료 포인트';
      case 'enter_referrer_point':
        return '추천인 입력 포인트';
      case 'referrer_point':
        return '추천인 포인트';
      default:
        return doc;
    }
  }

  static toHistoryEntities(dtos: PointHistoryResponse[]): PointHistory[] {
    return dtos.map((dto) => ({
      pointType: dto.point_type,
      title: this.toHistoryTitle(dto.doc),
      description: dto.description,
      date: dto.reg_date,
      point: dto.point
    }));
  }
}
