import { PaymentHistoryDTO } from "../PaymentDTO.ts"
import { PaymentHistory } from "../../PaymentHistory.ts"

export class PaymentMapper {
  static toHistoryEntity(dto: PaymentHistoryDTO): PaymentHistory {
    return {
      id: dto.orderid,
      index: dto.p_idx,
      paidAt: new Date(dto.pay_date),
      type: dto.pay_gubun,
      status: dto.pay_status,
      pointStatus: dto.point_status === "Y" ? "done" : "ready",
      point: dto.point,
      items: dto.paysub.map((sub) => ({
        index: sub.ps_idx,
        status: sub.ps_pay_current_status,
        name: sub.ps_name,
        brand: "약손명가", // TODO: (약손명가 | 달리아 스파 | 여리한) 구분할 값이 없어서 우선 약손명가로 하드코딩
        branchName: sub.b_name,
        amount: Number(sub.ps_total_amount),
        price: Number(sub.ps_total_price),
      })),
    }
  }

  static toHistoryEntities(dtos: PaymentHistoryDTO[]): PaymentHistory[] {
    return dtos.map((dto) => this.toHistoryEntity(dto))
  }
}
