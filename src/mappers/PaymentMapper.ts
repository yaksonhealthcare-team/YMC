import { PaymentHistory, PaymentHistoryResponse } from "../types/Payment.ts"

export class PaymentMapper {
  static toHistoryEntity(dto: PaymentHistoryResponse): PaymentHistory {
    return {
      id: dto.orderid,
      index: dto.p_idx,
      paidAt: new Date(dto.pay_date),
      type: dto.pay_gubun,
      status: dto.pay_status,
      pointStatus: dto.point_status === "적립" ? "done" : "yet",
      point: dto.point,
      items: dto.paysub.map((sub) => ({
        index: sub.ps_idx,
        name: sub.ps_name,
        status: sub.ps_pay_status,
        brand: sub.brand_name,
        branchName: sub.b_name,
        amount: Number(sub.ps_total_amount),
        price: Number(sub.ps_total_price),
      })),
    }
  }

  static toHistoryEntities(dtos: PaymentHistoryResponse[]): PaymentHistory[] {
    return dtos.map((dto) => this.toHistoryEntity(dto))
  }
}
