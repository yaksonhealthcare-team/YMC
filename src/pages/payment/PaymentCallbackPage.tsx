import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore"
import { PaymentStatus } from "../../types/Payment"
import { useOverlay } from "../../contexts/ModalContext"
import LoadingIndicator from "@components/LoadingIndicator"
import { useQuery } from "@tanstack/react-query"
import { fetchPoints } from "../../apis/points.api"

interface PaymentCallbackData {
  resultCode: string
  resultMessage: string
  body: {
    P_AMT: number
    P_TYPE?: string
    P_SIMPLE_TYPE?: string
    P_CARD_INFO?: {
      cardName: string
      installment: string
    }
    items: Array<{
      id: string
      brand: string
      branchType: string
      title: string
      duration: number
      options: Array<{
        sessions: number
        count: number
        price: number
        originalPrice: number
        ss_idx: string
      }>
      status: string
    }>
    discountAmount?: number
    pointAmount?: number
    pay_info: {
      amt: string
      type: string
      cardname: string
      quota: string
      paydate: string
      appno: string
      cardcd: string
      card_noinf: string
    }
    orderid: string
    p_idx: string[]
    mp_info: number[]
    cahereceipt_info: null
  }
}

export default function PaymentCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { openModal } = useOverlay()
  const { setPaymentStatus, clear: clearPayment } = usePaymentStore()

  // 포인트 조회
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
      const jsonData: PaymentCallbackData = JSON.parse(decodedStr)

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
      if (jsonData.body?.pay_info?.type === "CARD") {
        console.log("✅ 결제 성공")
        setPaymentStatus(PaymentStatus.SUCCESS)

        const paymentAmount = parseInt(jsonData.body.pay_info.amt)
        const totalAmount = paymentAmount + point // 실제 상품 금액은 결제금액 + 포인트

        navigate("/payment/complete", {
          state: {
            orderId: jsonData.body.orderid,
            items:
              jsonData.body.items?.map((item) => ({
                id: item.id,
                title: item.title || "상품명 없음",
                sessions: item.options?.[0]?.sessions || 0,
                amount: item.options?.[0]?.price || 0,
                brand: {
                  name: item.brand || "브랜드명 없음",
                  code: item.branchType || "000",
                },
                branch: {
                  name: jsonData.body.items?.[0]?.brand || "지점명 없음",
                  code: jsonData.body.items?.[0]?.branchType || "0",
                },
              })) || [],
            amount_info: {
              total_amount: totalAmount || 0,
              discount_amount: jsonData.body.discountAmount || 0,
              point_amount: point || 0,
              payment_amount: paymentAmount || 0,
            },
            point_info: {
              used_point: point || 0,
              remaining_point: Math.max(
                0,
                (availablePoint || 0) - (point || 0),
              ),
            },
            payment_info: {
              method: (jsonData.body.pay_info?.type || "UNKNOWN").toLowerCase(),
              card_info: {
                company: jsonData.body.pay_info?.cardname || "카드사 정보 없음",
                number: jsonData.body.pay_info?.card_noinf || "",
                installment_period:
                  parseInt(jsonData.body.pay_info?.quota) || 0,
                approval_number: jsonData.body.pay_info?.appno || "",
                approval_date: jsonData.body.pay_info?.paydate || "",
              },
            },
          },
        })
      } else {
        console.log("✅ 결제 성공 (카드 외 결제)")
        setPaymentStatus(PaymentStatus.SUCCESS)

        const paymentAmount = parseInt(jsonData.body.pay_info.amt)
        const totalAmount = paymentAmount + point // 실제 상품 금액은 결제금액 + 포인트

        navigate("/payment/complete", {
          state: {
            orderId: jsonData.body.orderid,
            items:
              jsonData.body.items?.map((item) => ({
                id: item.id,
                title: item.title || "상품명 없음",
                sessions: item.options?.[0]?.sessions || 0,
                amount: item.options?.[0]?.price || 0,
                brand: {
                  name: item.brand || "브랜드명 없음",
                  code: item.branchType || "000",
                },
                branch: {
                  name: jsonData.body.items?.[0]?.brand || "지점명 없음",
                  code: jsonData.body.items?.[0]?.branchType || "0",
                },
              })) || [],
            amount_info: {
              total_amount: totalAmount || 0,
              discount_amount: jsonData.body.discountAmount || 0,
              point_amount: point || 0,
              payment_amount: paymentAmount || 0,
            },
            point_info: {
              used_point: point || 0,
              remaining_point: Math.max(
                0,
                (availablePoint || 0) - (point || 0),
              ),
            },
            payment_info: {
              method: (jsonData.body.pay_info?.type || "UNKNOWN").toLowerCase(),
            },
          },
        })
      }

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
