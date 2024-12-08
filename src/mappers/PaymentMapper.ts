import {
  PaymentHistory,
  PaymentHistoryDetail,
  PaymentHistoryDetailResponse,
  PaymentHistoryResponse,
} from "../types/Payment.ts"

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
      category: dto.paysub.every((sub) => sub.ps_name.includes("추가"))
        ? "additional"
        : "membership", // TODO: 회원권 / 추가관리 구분 필드 생기면 변경할 것
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

  static toHistoryDetailEntity(
    dto: PaymentHistoryDetailResponse,
  ): PaymentHistoryDetail {
    return {
      id: dto.orderid,
      index: dto.p_idx,
      paidAt: new Date(dto.pay_date),
      type: dto.pay_gubun,
      status: dto.pay_status,
      pointStatus: dto.point_status === "적립" ? "done" : "yet",
      point: Number(dto.point),
      payMethod: dto.pay_method,
      totalPrice: Number(dto.total_price),
      usedPoint: Number(dto.use_point),
      actualPrice: Number(dto.actual_price),
      category: dto.paysub.every((sub) => sub.ps_name.includes("추가"))
        ? "additional"
        : "membership", // TODO: 회원권 / 추가관리 구분 필드 생기면 변경할 것
      items: dto.paysub.map((sub) => ({
        index: sub.p_idx,
        name: sub.ps_name,
        status: sub.ps_pay_status,
        brand: sub.brand_name,
        branchName: sub.b_name,
        amount: Number(sub.ps_total_amount),
        price: Number(sub.ps_total_price),
        cancel: {
          canceledAt: new Date(sub.payCancel.ps_cancel_pay_date),
          payMethod: sub.payCancel.ps_cancel_pg_paymethod,
          canceledPrice: Number(sub.payCancel.ps_cancel_price),
          usedPoint: Number(sub.payCancel.ps_cancel_use_point),
          refundPoint: Number(sub.payCancel.ps_cancel_refund_point),
          totalPrice: Number(sub.payCancel.ps_cancel_total_price),
          reason: sub.payCancel.ps_cancel_message,
        },
      })),
    }
  }
}
