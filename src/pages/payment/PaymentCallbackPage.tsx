import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore"
import { PaymentStatus } from "../../types/Payment"
import { useOverlay } from "../../contexts/ModalContext"

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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setPaymentStatus, clear: clearPayment } = usePaymentStore()
  const { openModal } = useOverlay()
  useEffect(() => {
    try {
      // 전체 URL 로깅
      console.group("💰 결제 콜백 데이터")
      console.log("전체 URL:", window.location.href)
      console.log(
        "전체 검색 파라미터:",
        Object.fromEntries(searchParams.entries()),
      )

      const jsonDataStr = searchParams.get("jsonData")
      console.log("Raw jsonData:", jsonDataStr)

      if (!jsonDataStr) {
        console.error("❌ jsonData 파라미터가 없음")
        throw new Error("결제 정보가 없습니다.")
      }

      const decodedStr = decodeURIComponent(jsonDataStr)
      console.log("Decoded jsonData:", decodedStr)

      const jsonData: PaymentCallbackData = JSON.parse(decodedStr)
      console.log("결제 응답 데이터:", {
        결과코드: jsonData.resultCode,
        결과메시지: jsonData.resultMessage,
        주문번호: jsonData.body?.orderid,
        결제정보: jsonData.body?.pay_info
          ? {
              결제금액: jsonData.body.pay_info.amt,
              결제수단: jsonData.body.pay_info.type,
              카드사: jsonData.body.pay_info.cardname,
              할부: jsonData.body.pay_info.quota,
              승인번호: jsonData.body.pay_info.appno,
            }
          : null,
      })

      // 결제 실패 또는 body가 null인 경우
      if (jsonData.resultCode !== "00" || !jsonData.body) {
        console.log("❌ 결제 실패:", jsonData.resultMessage)
        setPaymentStatus(PaymentStatus.FAILED)
        navigate("/payment/failed", {
          state: {
            error: jsonData.resultMessage || "결제에 실패했습니다.",
            code: jsonData.resultCode,
          },
        })
        return
      }

      // P_NOTI 파싱 시도
      const notiValue = searchParams.get("P_NOTI") || ""
      const [orderId, pointAmount] = notiValue.split(",")
      console.log("P_NOTI 파싱 결과:", {
        원본데이터: notiValue,
        주문번호: orderId,
        포인트: pointAmount,
        파싱성공여부: Boolean(orderId && pointAmount),
      })

      // URL 파라미터 전체 확인
      console.log("전체 파라미터 목록:", {
        P_STATUS: searchParams.get("P_STATUS"),
        P_RMESG1: searchParams.get("P_RMESG1"),
        P_TID: searchParams.get("P_TID"),
        P_REQ_URL: searchParams.get("P_REQ_URL"),
        P_NOTI: searchParams.get("P_NOTI"),
      })

      // 결제 성공: 00
      if (jsonData.resultCode === "00") {
        console.log("✅ 결제 성공")
        setPaymentStatus(PaymentStatus.SUCCESS)

        try {
          // 할부 개월 수 표시 형식 변경
          const installmentText =
            jsonData.body.pay_info.quota === "00"
              ? "일시불"
              : `${parseInt(jsonData.body.pay_info.quota)}개월`

          // 실제 결제된 금액과 포인트
          const paidAmount = Number(jsonData.body.pay_info.amt)
          const totalAmount = paidAmount // 총 금액은 실제 결제 금액과 동일

          navigate("/payment/complete", {
            state: {
              amount: totalAmount,
              type: "membership",
              items: [
                {
                  id: jsonData.body.orderid,
                  brand: "약손명가",
                  branchType: "지점",
                  title: "약손명가 멤버십",
                  sessions: 1,
                  price: totalAmount,
                  amount: 1,
                },
              ],
              paymentMethod: jsonData.body.pay_info.type.toLowerCase(),
              cardPaymentInfo: {
                cardName: jsonData.body.pay_info.cardname,
                installment: installmentText,
              },
              pointAmount: pointAmount ? Number(pointAmount) : 0,
              message: jsonData.resultMessage,
            },
          })
        } catch (error) {
          // 결제는 성공했지만 데이터 처리 중 오류가 발생한 경우
          console.error("⚠️ 결제 성공 후 데이터 처리 중 오류:", error)

          // 최소한의 정보로 결제 완료 페이지로 이동
          const paidAmount = Number(jsonData.body.pay_info.amt)
          const usedPoints = pointAmount ? Number(pointAmount) : 0
          const totalAmount = paidAmount + usedPoints

          navigate("/payment/complete", {
            state: {
              amount: totalAmount,
              type: "membership",
              items: [
                {
                  id: jsonData.body.orderid,
                  brand: "약손명가",
                  branchType: "지점",
                  title: "약손명가 멤버십",
                  sessions: 1,
                  price: totalAmount,
                  amount: 1,
                },
              ],
              paymentMethod: jsonData.body.pay_info.type.toLowerCase(),
              cardPaymentInfo: {
                cardName: jsonData.body.pay_info.cardname,
                installment: "일시불",
              },
              pointAmount: usedPoints,
              message:
                "결제가 완료되었습니다. 상세 정보 확인이 어려운 경우 고객센터로 문의해주세요.",
            },
          })
        }
        return
      }

      // 결제 실패
      console.log("❌ 결제 실패:", jsonData.resultMessage)
      setPaymentStatus(PaymentStatus.FAILED)
      navigate("/payment/failed", {
        state: {
          error: jsonData.resultMessage || "결제에 실패했습니다.",
          code: jsonData.resultCode,
        },
      })
    } catch (error) {
      console.error("❌ 결제 콜백 처리 중 오류 발생:", error)
      setPaymentStatus(PaymentStatus.FAILED)
      navigate("/payment/failed", {
        state: {
          error: "결제 정보 처리 중 오류가 발생했습니다.",
        },
      })
    } finally {
      console.groupEnd()
    }
  }, [searchParams, navigate, setPaymentStatus, openModal, clearPayment])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">결제 처리중입니다...</p>
        <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}
