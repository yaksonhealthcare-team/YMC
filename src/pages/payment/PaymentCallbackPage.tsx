import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore"
import { PaymentStatus, PaymentResponse } from "../../types/Payment"
import { useOverlay } from "../../contexts/ModalContext"
import LoadingIndicator from "@components/LoadingIndicator"
import { useQuery } from "@tanstack/react-query"
import { fetchPoints } from "../../apis/points.api"

export default function PaymentCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { openModal } = useOverlay()
  const { setPaymentStatus, clear: clearPayment } = usePaymentStore()

  const { data: availablePoint = 0 } = useQuery({
    queryKey: ["points"],
    queryFn: () => fetchPoints(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  })

  useEffect(() => {
    console.group("💰 결제 콜백 데이터")
    console.log("전체 URL:", window.location.href)

    // 이니시스 결제 응답 파라미터
    const searchParams = new URLSearchParams(location.search)
    const inicisParams = {
      P_STATUS: searchParams.get("P_STATUS"),
      P_RMESG1: searchParams.get("P_RMESG1"),
      P_TID: searchParams.get("P_TID"),
      P_REQ_URL: searchParams.get("P_REQ_URL"),
      P_NOTI: searchParams.get("P_NOTI"),
    }

    console.log("이니시스 응답 파라미터:", inicisParams)

    // P_NOTI 파싱 (주문번호,포인트)
    const pNoti = inicisParams.P_NOTI || ""
    const [orderId = "", pointStr = "0"] = pNoti.split(",")
    const point = parseInt(pointStr) || 0

    console.log("P_NOTI 파싱 결과:", {
      원본데이터: pNoti,
      주문번호: orderId,
      포인트: point,
      파싱성공여부: Boolean(orderId),
    })

    // jsonData 파싱
    const jsonDataStr = searchParams.get("jsonData")
    if (!jsonDataStr) {
      console.error("❌ jsonData가 없습니다.")
      setPaymentStatus(PaymentStatus.FAILED)
      navigate("/payment/failed", {
        state: {
          message: "결제 정보를 받아올 수 없습니다.",
        },
      })
      return
    }

    try {
      console.log("Raw jsonData:", jsonDataStr)
      const decodedStr = decodeURIComponent(jsonDataStr)
      console.log("Decoded jsonData:", decodedStr)
      const jsonData: PaymentResponse = JSON.parse(decodedStr)

      console.log("결제 응답 데이터:", {
        결과코드: jsonData.resultCode,
        결과메시지: jsonData.resultMessage,
        주문번호: jsonData.body?.orderid,
        결제정보: jsonData.body?.pay_info,
      })

      // 결제 실패 처리
      if (jsonData.resultCode !== "00") {
        console.error("❌ 결제 실패:", jsonData.resultMessage)
        setPaymentStatus(PaymentStatus.FAILED)
        navigate("/payment/failed", {
          state: {
            message: jsonData.resultMessage || "결제에 실패했습니다.",
          },
        })
        return
      }

      // 결제 성공 처리
      console.log("✅ 결제 성공")
      setPaymentStatus(PaymentStatus.SUCCESS)

      navigate("/payment/complete", {
        state: {
          orderId: jsonData.body.orderid,
          type: "additional",
          items: [
            {
              p_idx: jsonData.body.items.p_idx,
              title: jsonData.body.items.title,
              sessions: jsonData.body.items.sessions,
              amount: jsonData.body.items.amount,
              brand: jsonData.body.items.brand,
              branch: jsonData.body.items.branch,
            },
          ],
          paymentMethod: jsonData.body.pay_info.type,
          cardPaymentInfo:
            jsonData.body.pay_info.type === "CARD"
              ? {
                  cardName:
                    jsonData.body.pay_info.cardname || "카드사 정보 없음",
                  installment:
                    jsonData.body.pay_info.quota === "00"
                      ? "일시불"
                      : `${jsonData.body.pay_info.quota}개월`,
                }
              : undefined,
          amount_info: {
            total_amount: jsonData.body.amount_info.total_amount,
            discount_amount: jsonData.body.amount_info.discount_amount,
            point_amount: jsonData.body.amount_info.point_amount,
            payment_amount: jsonData.body.amount_info.payment_amount,
          },
          point_info: {
            used_point: jsonData.body.point_info.used_point,
            remaining_point: jsonData.body.point_info.remaining_point,
          },
          message: jsonData.resultMessage,
        },
      })

      clearPayment()
    } catch (error) {
      console.error("❌ 결제 데이터 파싱 실패:", error)
      setPaymentStatus(PaymentStatus.FAILED)
      navigate("/payment/failed", {
        state: {
          message: "결제 정보 처리 중 오류가 발생했습니다.",
        },
      })
    }

    console.groupEnd()
  }, [
    location,
    navigate,
    setPaymentStatus,
    openModal,
    clearPayment,
    availablePoint,
  ])

  return <LoadingIndicator className="min-h-screen" />
}
