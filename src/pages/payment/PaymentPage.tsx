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
    P_VBANK_DT?: string
    P_VBANK_TM?: string
  }
}

/**
 * TODO: 결제 연동 관련 확인사항
 * 1. UI/UX 개선
 *   - 결제수단별 아이콘 추가
 *   - 결제수단 선택 UI 디자인 검토
 *   - 모바일 웹/앱 대응 UI 확인
 *
 * 2. 결제수단 정책 확인
 *   - 실시간계좌이체(BANK) 지원 여부 확인
 *   - 각 결제수단별 테스트 계정 정보 확인
 *   - 결제취소 정책 확인
 *
 * 3. 기술검토 사항
 *   - P_RESERVED 파라미터 옵션 최적화
 *   - 에러코드별 대응 방안 수립
 *   - 모바일 앱 스키마 정책 확인
 */

const PaymentPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { openMessageBox } = useOverlay()

  const {
    items: paymentItems,
    selectedBranch,
    setItems: setPaymentItems,
    paymentStatus,
    setPaymentStatus,
    clear: clearPayment,
  } = usePaymentStore()

  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "bank" | "vbank"
  >("card")
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

      console.group("💰 주문서 요청")
      console.log("선택된 지점:", {
        지점명: selectedBranch.name,
        지점코드: selectedBranch.b_idx,
        브랜드코드: selectedBranch.brandCode,
      })
      console.log(
        "선택된 상품:",
        paymentItems.map((item) => ({
          상품명: item.title,
          상품코드: item.s_idx,
          옵션코드: item.ss_idx,
          수량: item.amount,
          가격: item.price,
          원가: item.originalPrice,
        })),
      )
      console.log("포인트 사용:", {
        사용가능_포인트: availablePoint,
        사용_포인트: pointAmount,
      })
      console.log("결제 정보:", {
        결제수단: selectedPayment,
        총_상품금액: totalAmount,
        할인금액: discountAmount,
        포인트사용: pointAmount,
        최종결제금액: finalAmount,
      })
      console.log("API 요청 데이터:", { orders })

      const response = await axiosClient.post<OrderResponse>(
        "/orders/memberships",
        { orders },
      )

      console.log("API 응답 데이터:", {
        결과코드: response.data.resultCode,
        결과메시지: response.data.resultMessage,
        주문번호: response.data.orderSheet?.orderid,
        주문자정보: {
          고객번호: response.data.orderer?.csm_idx,
          이름: response.data.orderer?.name,
          연락처: response.data.orderer?.hp,
          이메일: response.data.orderer?.email,
        },
        상품정보: response.data.orderSheet?.items.map((item) => ({
          상품명: item.membership.s_name,
          상품코드: item.membership.s_idx,
          지점명: item.branch.b_name,
          지점코드: item.branch.b_idx,
          옵션: {
            코드: item.option.ss_idx,
            수량: item.option.ss_count,
          },
          원가: item.origin_price,
          판매가: item.price,
          수량: item.amount,
        })),
        주문요약: {
          총_원가: response.data.orderSummary?.total_origin_price,
          총_판매가: response.data.orderSummary?.total_price,
          총_수량: response.data.orderSummary?.total_count,
        },
        PG정보: {
          상점아이디: response.data.pg_info?.P_MID,
          주문번호: response.data.pg_info?.P_OID,
          결제금액: response.data.pg_info?.P_AMT,
          상품명: response.data.pg_info?.P_GOODS,
          구매자: response.data.pg_info?.P_UNAME,
          결제완료URL: response.data.pg_info?.P_NEXT_URL,
          결제노티URL: response.data.pg_info?.P_NOTI_URL,
          결제방법: response.data.pg_info?.P_HPP_METHOD,
          부가정보: response.data.pg_info?.P_RESERVED,
          타임스탬프: response.data.pg_info?.P_TIMESTAMP,
        },
      })
      console.groupEnd()

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

    // 결제 상태 초기화
    setPaymentStatus(PaymentStatus.PENDING)

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

  const handlePayment = async () => {
    console.group("💰 결제 프로세스 시작")
    console.log("결제 시작 시간:", new Date().toISOString())

    try {
      // 유효성 검사
      if (!isAgreed) {
        console.log("❌ 결제 실패: 결제 진행 동의 누락")
        openMessageBox("결제 진행 동의가 필요합니다.")
        return
      }

      // 포인트 사용 금액 검증
      if (pointAmount > availablePoint) {
        console.log("❌ 결제 실패: 포인트 초과 사용", {
          사용시도: pointAmount,
          사용가능: availablePoint,
        })
        openMessageBox("사용 가능한 포인트를 초과했습니다.")
        return
      }

      if (pointAmount > totalAmount) {
        console.log("❌ 결제 실패: 결제금액 초과 포인트 사용", {
          사용시도: pointAmount,
          총상품금액: totalAmount,
        })
        openMessageBox("결제 금액보다 많은 포인트를 사용할 수 없습니다.")
        return
      }

      console.log("✅ 결제 전 유효성 검사 통과")

      // 주문서 발행 시도
      console.log("주문서 발행 시작...")
      const orderData = await createOrder.mutateAsync()

      if (!orderData.pg_info) {
        console.error("❌ 결제 실패: PG 정보 누락")
        throw new Error("결제 정보가 없습니다.")
      }

      if (!orderData.orderSheet?.orderid) {
        console.error("❌ 결제 실패: 주문번호 누락")
        throw new Error("주문번호가 없습니다.")
      }

      console.log("✅ 주문서 발행 완료")

      // PG사 결제 요청
      console.log("PG사 결제 요청 시작...")
      await requestPayment(orderData)
      console.log("✅ PG사 결제 요청 완료 (결제창 호출)")
    } catch (error) {
      console.group("❌ 결제 프로세스 에러")
      console.error("에러 발생 시간:", new Date().toISOString())
      console.error("에러 내용:", error)
      if (error instanceof Error) {
        console.error("에러 메시지:", error.message)
        console.error("에러 스택:", error.stack)
      }
      console.groupEnd()

      openMessageBox(
        error instanceof Error
          ? error.message
          : "결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.",
      )
    } finally {
      console.groupEnd()
    }
  }

  const requestPayment = async (orderData: OrderResponse) => {
    const goodsName =
      orderData.orderSheet.items.length > 1
        ? `${orderData.orderSheet.items[0].membership.s_name} 외 ${orderData.orderSheet.items.length - 1}건`
        : orderData.orderSheet.items[0].membership.s_name

    // 결제 요청 로그
    console.group("💰 PG사 결제 파라미터 세팅")
    console.log("결제 요청 시간:", new Date().toISOString())
    console.log("주문 정보:", {
      주문번호: orderData.orderSheet.orderid,
      상품명: goodsName,
      결제금액: finalAmount,
      포인트사용: pointAmount,
      최종결제금액: finalAmount,
      결제수단: selectedPayment,
    })

    // 기존 폼이 있다면 제거
    const existingForm = document.getElementById("inicisPaymentForm")
    if (existingForm) {
      document.body.removeChild(existingForm)
    }

    const paymentForm = document.createElement("form")
    paymentForm.id = "inicisPaymentForm"
    paymentForm.method = "POST"
    paymentForm.action = "https://mobile.inicis.com/smart/payment/"
    paymentForm.acceptCharset = "euc-kr"

    console.log("결제창 폼 생성:", {
      method: paymentForm.method,
      action: paymentForm.action,
      charset: paymentForm.acceptCharset,
    })

    const appendInput = (name: string, value: string) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      paymentForm.appendChild(input)
      console.log(`폼 파라미터 추가: ${name}=${value}`)
    }

    // 기본 파라미터
    interface BaseParams {
      P_INI_PAYMENT: string
      P_MID: string
      P_OID: string
      P_AMT: string
      P_GOODS: string
      P_UNAME: string
      P_NEXT_URL: string
      P_NOTI_URL: string
      P_NOTI: string
      P_CHARSET: string
      P_HPP_METHOD: string
      P_TIMESTAMP: string
      P_RESERVED?: string
      P_CARD_OPTION?: string
      P_VBANK_DT?: string
      P_VBANK_TM?: string
      P_MOBILE?: string
      P_APP_BASE?: string
    }

    // 결제수단별 기본값 설정
    let paymentMethod = ""
    let paymentReserved = "centerCd=Y" // 기본 옵션

    if (selectedPayment === "card") {
      paymentMethod = "CARD"
      paymentReserved +=
        "&twotrs_isp=Y&block_isp=Y&twotrs_isp_noti=N&apprun_check=Y"
    } else if (selectedPayment === "bank") {
      paymentMethod = "BANK"
    } else if (selectedPayment === "vbank") {
      paymentMethod = "VBANK"
      paymentReserved += "&vbank_receipt=Y&vbank_receipt_list=0"
    }

    // 모바일 앱 스키마 설정
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("chrome")) {
      paymentReserved += "&app_scheme=googlechromes://"
    } else if (userAgent.includes("naver")) {
      paymentReserved += "&app_scheme=naversearchapp://"
    } else if (userAgent.includes("kakaotalk")) {
      paymentReserved += "&app_scheme=kakaotalk://"
    } else if (userAgent.includes("facebook")) {
      paymentReserved += "&app_scheme=fb://"
    } else {
      // 기본 앱 스키마 설정 (웹뷰인 경우)
      paymentReserved += "&app_scheme=therapist://"
    }

    const baseParams: BaseParams = {
      P_INI_PAYMENT: paymentMethod,
      P_MID: orderData.pg_info.P_MID,
      P_OID: orderData.orderSheet.orderid,
      P_AMT: finalAmount.toString(),
      P_GOODS: goodsName,
      P_UNAME: orderData.orderer.name,
      P_NEXT_URL: orderData.pg_info.P_NEXT_URL,
      P_NOTI_URL: orderData.pg_info.P_NOTI_URL,
      P_NOTI: `${orderData.orderSheet.orderid},${pointAmount}`,
      P_CHARSET: "utf8",
      P_HPP_METHOD: "2",
      P_TIMESTAMP: orderData.pg_info.P_TIMESTAMP,
      P_RESERVED: paymentReserved,
      P_MOBILE: "Y",
      // 서버에서 제공하는 가상계좌 만료시간 사용
      ...(selectedPayment === "vbank" && {
        P_VBANK_DT: orderData.pg_info.P_VBANK_DT,
        P_VBANK_TM: orderData.pg_info.P_VBANK_TM,
      }),
    }

    // 카드 결제인 경우에만 카드 옵션 추가
    if (selectedPayment === "card") {
      baseParams.P_CARD_OPTION = ""
    }

    // 파라미터 추가
    Object.entries(baseParams).forEach(([key, value]) => {
      if (value !== undefined) {
        appendInput(key, value)
      }
    })

    document.body.appendChild(paymentForm)
    console.log("✅ 결제창 폼 DOM 추가 완료, 결제창 호출 시작")

    try {
      paymentForm.submit()
      console.log("✅ 결제창 폼 제출 완료")
    } catch (error) {
      console.error("❌ 결제창 호출 실패:", error)
      openMessageBox("결제창 호출에 실패했습니다. 다시 시도해주세요.")
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
          onPaymentMethodChange={setSelectedPayment}
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
