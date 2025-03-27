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
      category: dto.is_add_service === "Y" ? "additional" : "membership",
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

  static toHistoryEntities(
    dtos: PaymentHistoryResponse[],
    totalPageCount: number,
  ): PaymentHistory[] & { totalPageCount: number } {
    const entities = dtos.map((dto) => this.toHistoryEntity(dto))
    return Object.assign(entities, { totalPageCount })
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
      category: dto.is_add_service === "Y" ? "additional" : "membership",
      isOfflinePayment: !dto.orderid || dto.orderid === "",
      items: dto.paysub.map((sub) => ({
        index: sub.p_idx,
        name: sub.ps_name,
        status: sub.ps_pay_status,
        brand: sub.brand_name,
        branchName: sub.b_name,
        amount: Number(sub.ps_total_amount),
        price: Number(sub.ps_total_price),
        reservationId: sub.r_idx,
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
