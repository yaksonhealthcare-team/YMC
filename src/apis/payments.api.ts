import { PaymentHistoryResponse } from "types/Payment.ts"
import { PaymentMapper } from "../mappers/PaymentMapper.ts"

export const fetchPayments = async ({ page }: { page: number }) => {
  console.log(page)
  const data: { body: PaymentHistoryResponse[] } = {
    body: [
      {
        orderid: "241125135444424",
        p_idx: "1733835",
        pay_date: "2024-11-25 13:55:32",
        pay_type: "결제",
        pay_gubun: "앱결제",
        pay_status: "현장결제완료",
        pay_current_status: "현장결제완료",
        point_status: "N",
        point: 0,
        paysub: [
          {
            ps_idx: "1742711",
            ps_pay_status: "취소완료",
            ps_pay_current_status: "취소완료",
            ps_name: "얼굴추가1",
            ps_total_amount: "1",
            ps_total_price: "400",
            b_name: "전지점",
          },
          {
            ps_idx: "1733835",
            ps_pay_status: "취소완료",
            ps_pay_current_status: "취소완료",
            ps_name: "얼굴추가2",
            ps_total_amount: "10",
            ps_total_price: "7000",
            b_name: "전지점",
          },
        ],
      },
    ],
  }

  // TODO: Uncomment code below after API ready
  // const { data } = await axiosClient.get<HTTPResponse<PaymentHistoryDTO[]>>(
  //   "/payments/history",
  //   {
  //     params: { page: page },
  //   },
  // )
  //
  return PaymentMapper.toHistoryEntities(data.body)
}
