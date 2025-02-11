import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { Button } from "@components/Button.tsx"
import FixedButtonContainer from "@components/FixedButtonContainer.tsx"
import { useNavigate } from "react-router-dom"
import { usePaymentStore } from "../../hooks/usePaymentStore.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { fetchPoints } from "../../apis/points.api.ts"
import { axiosClient } from "../../queries/clients.ts"
import PaymentProductSection from "./_fragments/PaymentProductSection.tsx"
import PaymentPointSection from "./_fragments/PaymentPointSection.tsx"
import PaymentMethodSection from "./_fragments/PaymentMethodSection.tsx"
import PaymentSummarySection from "./_fragments/PaymentSummarySection.tsx"
import PaymentAgreementSection from "./_fragments/PaymentAgreementSection.tsx"
import { PaymentStatus } from "../../types/Payment.ts"
import { useOverlay } from "../../contexts/ModalContext"

interface OrderResponse {
  resultCode: string
  resultMessage: string
  orderer: {
    csm_idx: string
    name: string
    hp: string
    email: string
  }
  orderSheet: {
    orderid: string
    items: Array<{
      membership: {
        s_idx: string
        s_name: string
        s_time: string
      }
      branch: {
        b_idx: string
        b_name: string
      }
      option: {
        ss_idx: string
        ss_count: string
      }
      origin_price: string
      price: string
      amount: number
    }>
  }
  orderSummary: {
    total_origin_price: number
    total_price: number
    total_count: number
  }
  pg_info: {
    P_MID: string
    P_OID: string
    P_AMT: number
    P_GOODS: string
    P_UNAME: string
    P_NEXT_URL: string
    P_NOTI_URL: string
    P_HPP_METHOD: string
    P_RESERVED: string
    P_TIMESTAMP: string
  }
}

const PaymentPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { openMessageBox } = useOverlay()

  const {
    items: paymentItems,
    selectedBranch,
    setItems: setPaymentItems,
    paymentStatus,
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
    queryFn: () => fetchPoints(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  })

  // 주문서 발행 API 호출
  const createOrder = useMutation({
    mutationFn: async () => {
      if (!selectedBranch) {
        throw new Error("지점을 선택해주세요.")
      }

      if (!paymentItems || paymentItems.length === 0) {
        throw new Error("선택된 상품이 없습니다.")
      }

      const orders = paymentItems.map((item) => {
        if (
          !item.s_idx ||
          !item.ss_idx ||
          !selectedBranch ||
          !item.brand_code ||
          !item.amount
        ) {
          throw new Error("필수 데이터가 누락되었습니다.")
        }

        if (item.amount <= 0) {
          throw new Error("수량은 1개 이상이어야 합니다.")
        }

        const b_idx =
          typeof selectedBranch.b_idx === "string"
            ? parseInt(selectedBranch.b_idx)
            : selectedBranch.b_idx

        if (isNaN(b_idx)) {
          throw new Error("잘못된 지점 정보입니다.")
        }

        return {
          s_idx: Number(item.s_idx),
          ss_idx: Number(item.ss_idx),
          b_idx: b_idx,
          brand_code: item.brand_code,
          amount: Number(item.amount),
        }
      })

      const response = await axiosClient.post<OrderResponse>(
        "/orders/memberships",
        { orders },
      )

      if (response.data.resultCode !== "00") {
        throw new Error(
          response.data.resultMessage || "주문서 발행에 실패했습니다.",
        )
      }

      return response.data
    },
    retry: false,
    onError: (error) => {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
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

    // 500ms 후에 로딩 상태를 해제
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // 결제 상태와 데이터 유효성 체크를 위한 별도의 useEffect
  useEffect(() => {
    if (!isLoading && (paymentItems.length === 0 || !selectedBranch)) {
      navigate(-1)
      return
    }

    if (paymentStatus === PaymentStatus.SUCCESS) {
      clearPayment()
    }
  }, [paymentStatus, paymentItems, selectedBranch, isLoading])

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = value === "" ? 0 : parseInt(value)

    if (isNaN(numValue)) {
      return
    }

    if (numValue < 0) {
      setPoint("0")
      return
    }

    if (numValue > availablePoint) {
      setPoint(availablePoint.toString())
      return
    }

    setPoint(value)
  }

  const handleUseAllPoints = () => {
    setPoint(availablePoint.toString())
  }

  const handleCountChange = (cartId: string, newCount: number) => {
    if (newCount === 0) {
      handleDelete(cartId)
      return
    }

    const updatedItems = paymentItems.map((item) => {
      if (item.ss_idx.toString() === cartId) {
        return {
          ...item,
          amount: newCount,
        }
      }
      return item
    })

    setPaymentItems(updatedItems)
  }

  const handleDelete = (cartId: string) => {
    const updatedItems = paymentItems.filter(
      (item) => item.ss_idx.toString() !== cartId,
    )

    if (updatedItems.length === 0) {
      navigate(-1)
      return
    }

    setPaymentItems(updatedItems)
  }

  const requestPayment = async (orderData: OrderResponse) => {
    const paymentForm = document.createElement("form")
    paymentForm.method = "POST"
    paymentForm.action = "https://mobile.inicis.com/smart/payment/"
    paymentForm.charset = "euc-kr"
    paymentForm.acceptCharset = "euc-kr"

    const appendInput = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      paymentForm.appendChild(input)
    }

    const goodsName =
      orderData.orderSheet.items.length > 1
        ? `${orderData.orderSheet.items[0].membership.s_name} 외 ${orderData.orderSheet.items.length - 1}건`
        : orderData.orderSheet.items[0].membership.s_name

    // 결제 요청 로그
    console.group("💰 결제 요청 데이터")
    console.log("주문 정보:", {
      주문번호: orderData.pg_info.P_OID,
      상품명: goodsName,
      결제금액: finalAmount,
      포인트사용: pointAmount,
    })
    console.log("PG사 전송 파라미터:", {
      P_MID: orderData.pg_info.P_MID,
      P_OID: orderData.pg_info.P_OID,
      P_AMT: finalAmount,
      P_GOODS: goodsName,
      P_UNAME: orderData.orderer.name,
      P_NEXT_URL: orderData.pg_info.P_NEXT_URL,
      P_NOTI_URL: orderData.pg_info.P_NOTI_URL,
      P_NOTI: `${orderData.pg_info.P_OID},${pointAmount}`,
      P_RESERVED: "centerCd=Y",
      결제수단: selectedPayment,
      간편결제: simplePayment,
    })
    console.groupEnd()

    appendInput("P_MID", orderData.pg_info.P_MID)
    appendInput("P_OID", orderData.pg_info.P_OID)
    appendInput("P_AMT", finalAmount.toString())
    appendInput("P_GOODS", goodsName)
    appendInput("P_UNAME", orderData.orderer.name)
    appendInput("P_NEXT_URL", orderData.pg_info.P_NEXT_URL)
    appendInput("P_NOTI_URL", orderData.pg_info.P_NOTI_URL)
    appendInput("P_NOTI", `${orderData.pg_info.P_OID},${pointAmount}`)

    // 결제 수단에 따른 파라미터 추가
    if (selectedPayment === "card") {
      appendInput("P_RESERVED", "centerCd=Y")
    } else if (selectedPayment === "simple") {
      appendInput("P_RESERVED", `${simplePayment}Pay,centerCd=Y`)
    }

    document.body.appendChild(paymentForm)
    paymentForm.submit()
  }

  const handlePayment = async () => {
    if (!isAgreed) {
      openMessageBox("결제 진행 동의가 필요합니다.")
      return
    }

    // 포인트 사용 금액 검증
    if (pointAmount > availablePoint) {
      openMessageBox("사용 가능한 포인트를 초과했습니다.")
      return
    }

    if (pointAmount > totalAmount) {
      openMessageBox("결제 금액보다 많은 포인트를 사용할 수 없습니다.")
      return
    }

    try {
      const orderData = await createOrder.mutateAsync()

      if (!orderData.pg_info) {
        throw new Error("결제 정보가 없습니다.")
      }

      if (!orderData.orderSheet?.orderid) {
        throw new Error("주문번호가 없습니다.")
      }

      await requestPayment(orderData)
    } catch (error) {
      console.error("결제 프로세스 에러:", error)
      openMessageBox(
        error instanceof Error
          ? error.message
          : "결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.",
      )
    }
  }

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

  if (isLoading || isPointLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 border-gray-50 pb-[88px]">
        <PaymentProductSection
          paymentItems={paymentItems}
          onCountChange={handleCountChange}
          onDelete={handleDelete}
        />

        <PaymentPointSection
          point={point}
          availablePoint={availablePoint}
          onPointChange={handlePointChange}
          onUseAllPoints={handleUseAllPoints}
        />

        <PaymentMethodSection
          selectedPayment={selectedPayment}
          simplePayment={simplePayment}
          onPaymentMethodChange={setSelectedPayment}
          onSimplePaymentChange={setSimplePayment}
        />

        <PaymentSummarySection
          totalAmount={totalAmount}
          discountAmount={discountAmount}
          pointAmount={pointAmount}
          finalAmount={finalAmount}
        />

        <PaymentAgreementSection
          isAgreed={isAgreed}
          onAgreementChange={setIsAgreed}
        />
      </div>

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
