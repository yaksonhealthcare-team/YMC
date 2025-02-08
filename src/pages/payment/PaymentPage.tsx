import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import PaymentCard from "@components/PaymentCard.tsx"
import { Divider } from "@mui/material"
import { Button } from "@components/Button.tsx"
import FixedButtonContainer from "@components/FixedButtonContainer.tsx"
import { Radio } from "@components/Radio.tsx"
import { useNavigate } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { CartItemOption } from "../../types/Cart.ts"
import { fetchPoints } from "../../apis/points.api.ts"

interface OrderResponse {
  orderId: string
  pgMid: string
  timestamp: string
  signature: string
  returnUrl: string
  amount: number
}

const PaymentPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const {
    items: paymentItems,
    selectedBranch,
    clear: clearPayment,
  } = usePaymentStore()
  const [isLoading, setIsLoading] = useState(true)

  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "simple" | "virtual"
  >("card")
  const [simplePayment, setSimplePayment] = useState<
    "naver" | "kakao" | "payco"
  >("naver")
  const [point, setPoint] = useState<string>("")
  const [isAgreed, setIsAgreed] = useState(false)

  // 포인트 조회
  const { data: availablePoint = 0, isLoading: isPointLoading } = useQuery({
    queryKey: ["points"],
    queryFn: fetchPoints,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    retry: 1,
  })

  const navigate = useNavigate()

  // 주문서 발행 API 호출
  const createOrder = useMutation({
    mutationFn: async () => {
      const response = await axios.post<OrderResponse>(
        "/api/orders/memberships",
        {
          membershipId: paymentItems[0]?.s_idx,
          point: pointAmount,
        },
      )
      return response.data
    },
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "결제하기",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({
      display: false,
    })

    // 결제 정보가 없으면 이전 페이지로 이동
    if (paymentItems.length === 0 || !selectedBranch) {
      navigate(-1)
      return
    }

    // 0.5초 동안 로딩 화면 표시
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // 뒤로가기 버튼 처리
  useEffect(() => {
    const handlePopState = () => {
      clearPayment()
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const calculateTotalAmount = () => {
    return paymentItems.reduce(
      (total, item) => total + item.price * item.amount,
      0,
    )
  }

  const totalAmount = calculateTotalAmount()
  const discountAmount = paymentItems.reduce((total, item) => {
    if (item.originalPrice) {
      return total + (item.originalPrice - item.price) * item.amount
    }
    return total
  }, 0)
  const pointAmount = point ? parseInt(point) : 0
  const finalAmount = totalAmount - pointAmount

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = value === "" ? 0 : parseInt(value)

    // 숫자가 아닌 경우
    if (isNaN(numValue)) {
      return
    }

    // 음수인 경우
    if (numValue < 0) {
      setPoint("0")
      return
    }

    // 사용 가능한 포인트보다 큰 경우
    if (numValue > availablePoint) {
      setPoint(availablePoint.toString())
      return
    }

    setPoint(value)
  }

  const handleUseAllPoints = () => {
    setPoint(availablePoint.toString())
  }

  // 이니시스 결제 요청
  const requestPayment = async (orderData: OrderResponse) => {
    const paymentForm = document.createElement("form")
    paymentForm.method = "POST"
    paymentForm.action = "https://mobile.inicis.com/smart/payment/"
    paymentForm.acceptCharset = "UTF-8"

    const appendInput = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      paymentForm.appendChild(input)
    }

    // 필수 파라미터
    appendInput("P_MID", orderData.pgMid)
    appendInput("P_OID", orderData.orderId)
    appendInput("P_AMT", orderData.amount.toString())
    appendInput("P_GOODS", paymentItems[0]?.title || "약손한의원 회원권")
    appendInput("P_UNAME", "회원")
    appendInput("P_NEXT_URL", orderData.returnUrl)
    appendInput("P_NOTI", `${orderData.orderId},${pointAmount}`)
    appendInput("P_RESERVED", "centerCd=Y")

    // 결제수단별 파라미터
    switch (selectedPayment) {
      case "card":
        appendInput("P_INI_PAYMENT", "CARD")
        break
      case "simple":
        switch (simplePayment) {
          case "naver":
            appendInput("P_INI_PAYMENT", "NAVERPAY")
            break
          case "kakao":
            appendInput("P_INI_PAYMENT", "KAKAOPAY")
            break
          case "payco":
            appendInput("P_INI_PAYMENT", "PAYCO")
            break
        }
        break
      case "virtual":
        appendInput("P_INI_PAYMENT", "VBANK")
        break
    }

    document.body.appendChild(paymentForm)
    paymentForm.submit()
  }

  const handlePayment = async () => {
    if (!isAgreed) {
      alert("결제 진행 동의가 필요합니다.")
      return
    }

    try {
      const orderData = await createOrder.mutateAsync()
      await requestPayment(orderData)
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error)
      alert("결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  if (isLoading || isPointLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 border-gray-50 pb-[88px]">
        {/* 상품 목록 섹션 */}
        <div className="p-5">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-gray-700 font-sb text-16px">담은 회원권</span>
            <span className="text-primary font-sb text-16px">
              {paymentItems.length}개
            </span>
          </div>
          
            <div className="flex flex-col gap-4">
              {paymentItems.map((item) => (
                <PaymentCard
                  key={item.ss_idx}
                  brand={item.brand}
                  branchType={item.branchType}
                  title={item.title}
                  duration={item.duration}
                  options={[
                    {
                      items: [
                        {
                          cartId: item.ss_idx.toString(),
                          count: item.amount,
                        },
                      ],
                      sessions: item.sessions,
                      price: item.price,
                      originalPrice: item.originalPrice || item.price,
                    } satisfies CartItemOption,
                  ]}
                  onCountChange={() => {
                    // 바로구매에서는 수량 변경 불가
                  }}
                  onDelete={() => {
                    // 바로구매에서는 삭제 불가
                  }}
                />
              ))}
            </div>
        </div>

        {/* 포인트 섹션 */}
        <div className="p-5 border-b-8 border-gray-50">
          <h2 className="text-gray-700 font-sb text-16px mb-4">포인트</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={point}
              onChange={handlePointChange}
              placeholder="0"
              className="flex-1 p-3 border border-gray-100 rounded-xl font-r text-16px"
            />
            <Button
              variantType="secondary"
              sizeType="s"
              onClick={handleUseAllPoints}
              disabled={availablePoint === 0}
              className="!px-[20px] shrink-0 h-[52px] text-[16px]"
            >
              전액 사용
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-14px font-m">
              사용 가능 포인트
            </span>
            <span className="text-primary text-14px font-m">
              {availablePoint.toLocaleString()}P
            </span>
          </div>
        </div>

        {/* 결제수단 섹션 */}
        <div className="p-5 border-b-8 border-gray-50">
          <h2 className="text-gray-700 font-sb text-16px mb-4">결제수단</h2>
          <div className="flex flex-col">
            <Radio
              checked={selectedPayment === "card"}
              onChange={() => setSelectedPayment("card")}
              label="카드결제"
              className="py-4 border-b border-[#ECEFF2]"
            />

            <Radio
              checked={selectedPayment === "simple"}
              onChange={() => setSelectedPayment("simple")}
              label="간편결제"
              className="py-4"
            />

            {selectedPayment === "simple" && (
              <div className="pb-4 pl-9 flex gap-2">
                <Button
                  variantType={
                    simplePayment === "naver" ? "primary" : "grayLine"
                  }
                  sizeType="s"
                  onClick={() => setSimplePayment("naver")}
                  className={`h-[40px] text-14px ${simplePayment === "naver" ? "font-[500]" : "font-[400]"}`}
                >
                  네이버 페이
                </Button>
                <Button
                  variantType={
                    simplePayment === "kakao" ? "primary" : "grayLine"
                  }
                  sizeType="s"
                  onClick={() => setSimplePayment("kakao")}
                  className={`h-[40px] text-14px ${simplePayment === "kakao" ? "font-[500]" : "font-[400]"}`}
                >
                  카카오페이
                </Button>
                <Button
                  variantType={
                    simplePayment === "payco" ? "primary" : "grayLine"
                  }
                  sizeType="s"
                  onClick={() => setSimplePayment("payco")}
                  className={`h-[40px] text-14px ${simplePayment === "payco" ? "font-[500]" : "font-[400]"}`}
                >
                  페이코
                </Button>
              </div>
            )}

            <div className="border-b border-[#ECEFF2]" />

            <Radio
              checked={selectedPayment === "virtual"}
              onChange={() => setSelectedPayment("virtual")}
              label="가상계좌"
              className="py-4"
            />
          </div>
        </div>

        {/* 결제 금액 섹션 */}
        <div className="p-5 border-b-8 border-gray-50">
          <h2 className="text-gray-700 font-sb text-16px mb-4">결제 금액</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">상품 금액</span>
              <span className="text-gray-700 font-sb text-14px">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">
                상품할인금액
              </span>
              <span className="text-success font-sb text-14px">
                -{discountAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">
                포인트 사용
              </span>
              <span className="text-success font-sb text-14px">
                -{pointAmount.toLocaleString()}원
              </span>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-16px font-m">최종결제금액</span>
            <span className="text-gray-700 font-b text-20px">
              {finalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 동의 체크박스 */}
        <div className="p-5">
          <label className="flex items-start gap-3 items-center">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="mt-1"
              style={{
                appearance: "none",
                width: "20px",
                minWidth: "20px",
                height: "20px",
                borderRadius: "4px",
                backgroundColor: isAgreed ? "#F37165" : "white",
                border: isAgreed ? "1px solid #F37165" : "1px solid #DDDDDD",
                backgroundImage: isAgreed
                  ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                  : "none",
              }}
            />
            <span className="text-black text-14px font-r">
              상품, 가격, 할인정보, 유의사항 등을 확인하였으며 구매에
              동의합니다. (필수)
            </span>
          </label>
        </div>

        {/* 유의사항 */}
        <div className="px-5 py-3 bg-gray-50">
          <p className="text-gray-500 text-12px font-m">
            결제 유의사항이 들어가는 곳입니다. 결제 유의사항이 들어가는
            곳입니다. 결제 유의사항이 들어가는 곳입니다. 결제 유의사항이
            들어가는 곳입니다.
          </p>
        </div>
        {/* <div className="w-full h-[96px]" /> */}
      </div>

      {/* 하단 결제 버튼 */}
      <FixedButtonContainer className={"bg-white"}>
        <Button
          variantType="primary"
          sizeType="l"
          disabled={!isAgreed}
          onClick={handlePayment}
          className="w-full"
        >
          {finalAmount.toLocaleString()}원 결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentPage
