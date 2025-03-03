import { useNavigate, useParams } from "react-router-dom"
import {
  usePaymentCancel,
  usePaymentHistory,
} from "../../queries/usePaymentQueries.tsx"
import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { Button } from "@components/Button.tsx"
import { PaymentHistoryItem } from "../../types/Payment.ts"
import CheckIcon from "@components/icons/CheckIcon.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import { AxiosError } from "axios"
import LoadingIndicator from "@components/LoadingIndicator"
import { escapeHtml } from "utils/sanitize"

const PaymentCancelItemCard = ({
  item,
  selected,
  onClick,
}: {
  item: PaymentHistoryItem
  selected: boolean
  onClick: () => void
}) => {
  const canceled = item.status.includes("취소")

  return (
    <div
      className={`p-5 flex flex-col gap-2 border rounded-2xl ${canceled ? "border-gray-100" : selected ? "border-primary" : "border-gray-200"}`}
      onClick={canceled ? undefined : onClick}
    >
      <div className={"flex justify-between items-center"}>
        <p className={`font-sb ${canceled && "text-gray-400"}`}>{item.name}</p>
        {!canceled && (
          <CheckIcon htmlColor={selected ? "#F37165" : "#DDDDDD"} />
        )}
      </div>
      {canceled ? (
        <p className={"text-gray-400 text-12px"}>취소완료</p>
      ) : (
        <div className={"flex gap-2 items-center"}>
          <p className={"text-12px text-gray-500"}>{`${item.amount}회`}</p>
          <div className={"h-[12px] w-[1px] bg-gray-200"} />
          <p
            className={"text-12px text-gray-500"}
          >{`${item.branchName} 사용 가능`}</p>
        </div>
      )}
    </div>
  )
}

const MIN_REASON_LENGTH = 5
const MAX_REASON_LENGTH = 100

const PaymentCancelPage = () => {
  const { id } = useParams()
  const { data: payment, isLoading } = usePaymentHistory(id!)
  const { mutateAsync: cancelPayment } = usePaymentCancel()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { showToast } = useOverlay()

  const [step, setStep] = useState<"select" | "form">("select")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [reason, setReason] = useState("")

  useEffect(() => {
    setHeader({
      left: "back",
      title: "결제 취소 요청",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  if (!payment || isLoading)
    return <LoadingIndicator className="min-h-screen" />

  const handleSubmit = async () => {
    if (step === "form" && reason.length < MIN_REASON_LENGTH) {
      return
    }

    if (step === "form") {
      // 취소 사유 이스케이프 처리
      const sanitizedReason = escapeHtml(reason)

      try {
        await cancelPayment({
          orderId: payment.id,
          paymentIds: selectedItems,
          reason: sanitizedReason,
        })
        navigate("/payment/cancel/complete")
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message
          if (errorMessage?.includes("already used")) {
            showToast("이미 사용 중이거나 사용 완료된 회원권입니다")
          } else if (errorMessage?.includes("expired")) {
            showToast("만료된 회원권입니다")
          } else if (errorMessage?.includes("not found")) {
            showToast("존재하지 않는 결제 내역입니다")
          } else {
            showToast(errorMessage || "결제 취소 요청에 실패했습니다")
          }
        } else {
          showToast("결제 취소 요청에 실패했습니다")
        }
      }
    } else {
      navigate("/member-history/payment")
    }
  }

  switch (step) {
    case "select":
      return (
        <div className={"flex flex-col h-full justify-between overflow-hidden"}>
          <div className={"flex flex-col overflow-scroll p-5"}>
            <p className={"font-sb text-gray-300"}>
              <span className={"text-primary"}>1</span>/2
            </p>
            <p className={"font-b text-20px mt-2"}>{"상품을 선택해주세요."}</p>
            <ul className={"mt-10 space-y-4"}>
              {payment.items.map((item, index) => (
                <li key={index}>
                  <PaymentCancelItemCard
                    selected={selectedItems.includes(item.index)}
                    item={item}
                    onClick={() => {
                      if (selectedItems.includes(item.index)) {
                        setSelectedItems((prev) =>
                          [...prev].filter((id) => id !== item.index),
                        )
                      } else {
                        setSelectedItems((prev) => [...prev, item.index])
                      }
                    }}
                  />
                </li>
              ))}
              <p className={"text-14px text-gray-500"}>
                {
                  "* 이미 사용 중이거나, 사용 완료된 회원권은 결제 취소가 불가능합니다."
                }
              </p>
            </ul>
          </div>
          <div className={"border-t border-gray-100 px-5 pt-3 pb-8"}>
            <Button
              className={"w-full"}
              onClick={() => setStep("form")}
              disabled={selectedItems.length === 0}
            >
              {`총 ${selectedItems.length}개 선택`}
            </Button>
          </div>
        </div>
      )
    case "form":
      return (
        <div className={"flex flex-col h-full justify-between overflow-hidden"}>
          <div className={"flex flex-col overflow-scroll p-5"}>
            <p className={"font-sb text-gray-300"}>
              <span className={"text-primary"}>2</span>/2
            </p>
            <p className={"font-b text-20px mt-2"}>
              {"취소 사유를 말씀해주세요."}
            </p>
            <div className={"mt-10"}>
              <textarea
                className={
                  "w-full rounded-lg border border-gray-200 resize-none active:border-gray-500 focus:border-gray-500 outline-none py-3 px-4"
                }
                placeholder={"취소 사유를 입력해주세요"}
                rows={5}
                minLength={MIN_REASON_LENGTH}
                maxLength={MAX_REASON_LENGTH}
                onChange={(e) => setReason(e.target.value)}
              />
              <div
                className={
                  "flex justify-between items-center text-gray-400 text-12px"
                }
              >
                <p>{`${MIN_REASON_LENGTH}자 이상 작성해주세요.`}</p>
                <p>{`${reason.length} / ${MAX_REASON_LENGTH}`}</p>
              </div>
            </div>
            <p className={"text-14px text-gray-500 mt-4"}>
              {
                "* 이미 사용 중이거나, 사용 완료된 회원권은 결제 취소가 불가능합니다."
              }
            </p>
          </div>
          <div className={"border-t border-gray-100 px-5 pt-3 pb-8"}>
            <Button
              className={"w-full"}
              onClick={handleSubmit}
              disabled={
                reason.length < MIN_REASON_LENGTH ||
                reason.length > MAX_REASON_LENGTH
              }
            >
              {"취소하기"}
            </Button>
          </div>
        </div>
      )
  }
}

export default PaymentCancelPage
