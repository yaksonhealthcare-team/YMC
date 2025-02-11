import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore"
import { PaymentStatus } from "../../types/Payment"
import { useOverlay } from "../../contexts/ModalContext"

interface PaymentCallbackData {
  resultCode: string
  resultMessage: string
  body: Record<string, unknown>
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
      console.log("Parsed 결제 데이터:", {
        resultCode: jsonData.resultCode,
        resultMessage: jsonData.resultMessage,
        body: jsonData.body,
      })

      // 결제 성공: 00
      if (jsonData.resultCode === "00") {
        console.log("✅ 결제 성공")
        setPaymentStatus(PaymentStatus.SUCCESS)
        navigate("/payment/success", {
          state: {
            ...jsonData.body,
            message: jsonData.resultMessage,
          },
        })
        return
      }

      // 결제 취소: 61
      if (jsonData.resultCode === "61") {
        console.log("ℹ️ 결제 취소됨")
        setPaymentStatus(PaymentStatus.CANCELED)
        alert("결제가 취소되었습니다.")
        navigate(-1) // 결제 페이지로 돌아가기
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
