import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { Button } from "@components/Button.tsx"
import FixedButtonContainer from "@components/FixedButtonContainer.tsx"
import { Divider } from "@mui/material"
import CheckCircle from "@assets/icons/CheckCircle.svg"
import AdditionalServiceCard from "@components/AdditionalServiceCard.tsx"
import OrderSummaryCard from "@components/OrderSummaryCard.tsx"
import { XIcon } from "@components/icons/XIcon.tsx"

interface CartOption {
  sessions: number
  count: number
  price: number
  originalPrice: number
}

interface CartItem {
  id: string
  brand: string
  branchType: "전지점" | "지정 지점"
  title: string
  duration: number
  options: CartOption[]
  status: "결제완료" | "결제미완료"
}

interface AdditionalItem {
  id: string
  title: string
  duration: number
  price: number
}

interface PaymentCompleteState {
  amount: number
  type: "membership" | "additional"
  items: CartItem[] | AdditionalItem[]
  paymentMethod: "card" | "simple" | "virtual"
  simplePaymentType?: "naver" | "kakao" | "payco"
  cardPaymentInfo?: {
    cardName: string
    installment: string
  }
}

const PaymentCompletePage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [state, setState] = useState<PaymentCompleteState>({
    amount: 0,
    type: "membership",
    items: [],
    paymentMethod: "card",
  })

  useEffect(() => {
    // TODO: 실제 결제 정보를 받아와서 state에 설정
    const dummyState: PaymentCompleteState = {
      amount: 4953600,
      type: "membership",
      items: [
        {
          id: "1",
          brand: "약손명가",
          branchType: "전지점",
          title: "K-BEAUTY 연예인관리",
          duration: 120,
          options: [
            {
              sessions: 30,
              count: 1,
              price: 1032000,
              originalPrice: 1238400,
            },
            {
              sessions: 10,
              count: 2,
              price: 1032000,
              originalPrice: 1238400,
            },
          ],
          status: "결제완료",
        },
      ],
      paymentMethod: "simple",
      simplePaymentType: "naver",
    }
    setState(dummyState)
  }, [])

  useEffect(() => {
    setHeader({
      display: true,
      title: "결제완료",
      right: <XIcon onClick={handleClose} />,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const handleClose = () => {
    //TODO:
    navigate("/")
  }

  const renderItems = () => {
    if (state.type === "membership") {
      return (state.items as CartItem[]).map((item) => (
        <OrderSummaryCard key={item.id} {...item} />
      ))
    }

    return (state.items as AdditionalItem[]).map((item) => (
      <AdditionalServiceCard key={item.id} {...item} />
    ))
  }

  const renderPaymentInfo = () => {
    if (state.paymentMethod === "card") {
      return (
        <div className="px-5 py-6">
          <p className="text-gray-700 font-sb text-16px">
            카드결제 ({state.cardPaymentInfo?.cardName} /{" "}
            {state.cardPaymentInfo?.installment})
          </p>
        </div>
      )
    }

    if (state.paymentMethod === "simple") {
      return (
        <div className="px-5 py-6">
          <p className="text-gray-700 font-sb text-16px">
            간편결제 (
            {state.simplePaymentType === "naver"
              ? "네이버페이"
              : state.simplePaymentType === "kakao"
                ? "카카오페이"
                : "페이코"}
            )
          </p>
        </div>
      )
    }

    if (state.paymentMethod === "virtual") {
      return (
        <>
          <div className="px-5 py-6">
            <p className="text-gray-700 font-sb text-16px">가상계좌</p>
          </div>
          <Divider />
          <div className="px-5 py-6 flex flex-col gap-4">
            <p className="text-center text-gray-700 font-sb text-16px">
              입금 정보
            </p>
            <div className="py-5 px-4 bg-gray-50 rounded-[20px] flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="font-m text-14px text-gray-500">입금은행</span>
                <span className="font-sb text-14px text-gray-700">
                  우리은행 1234123412342
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-m text-14px text-gray-500">예금주</span>
                <span className="font-sb text-14px text-gray-700">
                  주식회사 약손명가
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-m text-14px text-gray-500">입금기한</span>
                <span className="font-sb text-14px text-error">
                  2024-10-10 (목) 23시 59분까지
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-m text-16px text-gray-700">입금금액</span>
              <span className="font-b text-20px text-gray-700">
                {state.amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </>
      )
    }
  }

  const isMembership = state.type === "membership"
  const isAdditional = state.type === "additional"
  const isVirtual = state.paymentMethod === "virtual"

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-5 flex flex-col gap-4 items-center border-b-8 border-gray-50">
        <img src={CheckCircle} />
        <p className="text-primary font-sb text-16px">결제가 완료되었습니다.</p>
      </div>

      {/* 주문 내역 */}
      <div className="p-5  border-b-8 border-gray-50">
        <div className="flex items-center gap-1 mb-4">
          <span className="text-gray-700 font-sb text-16px">주문내역</span>
          <span className="text-primary font-sb text-16px">
            {state.items.length}건
          </span>
        </div>
        {renderItems()}
      </div>

      {/* 결제 정보 */}
      <div className={"border-b-8 border-gray-50"}>{renderPaymentInfo()}</div>

      {/* 결제 금액 내역 */}
      <div className="p-5 flex flex-col gap-4">
        <p className="font-sb text-16px text-gray-700">결제 내역</p>
        <div className="flex flex-col gap-4 py-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-m text-14px text-gray-500">상품 금액</span>
            <span className="font-sb text-14px text-gray-700">
              {state.amount.toLocaleString()}원
            </span>
          </div>
          {isMembership && (
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">
                상품할인금액
              </span>
              <span className="font-sb text-14px text-success">-825,600원</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-m text-14px text-gray-500">포인트 사용</span>
            <span className="font-sb text-14px text-success">-2,000원</span>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <span className="font-m text-16px text-gray-700">
              {isVirtual ? "입금금액" : "최종결제금액"}
            </span>
            <span className="font-b text-20px text-gray-700">
              {(
                state.amount -
                (isMembership ? 825600 : 0) -
                2000
              ).toLocaleString()}
              원
            </span>
          </div>
          {isVirtual && (
            <p className="self-end text-error font-sb text-14px">결제미완료</p>
          )}
        </div>
        <div className="w-full h-[96px]" />
      </div>

      {/* 하단 버튼 */}
      <FixedButtonContainer className={"bg-white"}>
        <div className="flex gap-2 w-full">
          <Button
            variantType="line"
            sizeType="m"
            onClick={() => navigate("/")}
            fullWidth
          >
            홈으로 돌아가기
          </Button>
          <Button
            variantType="primary"
            sizeType="m"
            onClick={() =>
              navigate(
                isAdditional ? "/member-history?tab=resv" : "/reservation/list",
              )
            }
            fullWidth
          >
            {isAdditional ? "예약내역 보기" : "예약하러 가기"}
          </Button>
        </div>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentCompletePage
