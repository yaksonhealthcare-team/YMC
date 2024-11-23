import { PointHistoryDTO } from "../PointDTO.ts"
import { PointHistory } from "../../Point.ts"

export class PointMapper {
  static toHistoryTitle(doc: string) {
    switch (doc) {
      case "online_payment_point":
        return "온라인 포인트"
      case "offline_payment_point":
        return "오프라인 포인트"
      default:
        return doc
    }
  }

  static toHistoryEntities(dtos: PointHistoryDTO[]): PointHistory[] {
    return dtos.map((dto) => ({
      pointType: dto.point_type,
      title: this.toHistoryTitle(dto.doc),
      description: dto.description,
      date: dto.reg_date,
      point: dto.point,
    }))
  }
}
