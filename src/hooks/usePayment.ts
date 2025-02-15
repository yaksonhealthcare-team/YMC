import { useOverlay } from "contexts/ModalContext"
import { OrderResponse, BasePaymentParams } from "types/Payment"
import { usePaymentStore } from "./usePaymentStore"
import { createOrder } from "apis/order.api"

export const usePayment = () => {
  const { showToast } = useOverlay()
  const { points, selectedPaymentMethod } = usePaymentStore()

  const requestPayment = async (orderData: OrderResponse) => {
    const appendInput = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      return input
    }

    const form = document.createElement("form")
    form.name = "SendPayForm"
    form.method = "post"
    form.action = "https://mobile.inicis.com/smart/payment/"

    const paymentMethod = selectedPaymentMethod?.toUpperCase() || "CARD"

    const params: BasePaymentParams = {
      P_INI_PAYMENT: paymentMethod,
      P_MID: orderData.pg_info.P_MID,
      P_OID: orderData.pg_info.P_OID,
      P_AMT: String(orderData.pg_info.P_AMT),
      P_GOODS: orderData.pg_info.P_GOODS,
      P_UNAME: orderData.pg_info.P_UNAME,
      P_NEXT_URL: orderData.pg_info.P_NEXT_URL,
      P_NOTI_URL: orderData.pg_info.P_NOTI_URL,
      P_NOTI: "",
      P_CHARSET: "utf8",
      P_HPP_METHOD: orderData.pg_info.P_HPP_METHOD,
      P_TIMESTAMP: orderData.pg_info.P_TIMESTAMP,
      P_RESERVED: orderData.pg_info.P_RESERVED,
      P_MOBILE: "Y",
      P_APP_BASE: "Y",
    }

    if (orderData.pg_info.P_VBANK_DT) {
      params.P_VBANK_DT = orderData.pg_info.P_VBANK_DT
    }
    if (orderData.pg_info.P_VBANK_TM) {
      params.P_VBANK_TM = orderData.pg_info.P_VBANK_TM
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        form.appendChild(appendInput(key, value))
      }
    })

    document.body.appendChild(form)
    form.submit()
  }

  const handlePayment = async () => {
    try {
      const response = await createOrder(points.usedPoints)

      if (response.resultCode !== "00") {
        showToast(response.resultMessage)
        return
      }

      await requestPayment(response)
    } catch (error) {
      console.error("결제 요청 실패:", error)
      showToast("결제 요청에 실패했습니다.")
    }
  }

  return {
    handlePayment,
  }
}
