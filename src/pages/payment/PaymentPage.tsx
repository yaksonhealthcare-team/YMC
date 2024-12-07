import React, { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import CartCard from "@components/CartCard.tsx"
import { Divider } from "@mui/material"
import { Button } from "@components/Button.tsx"
import FixedButtonContainer from "@components/FixedButtonContainer.tsx"
import { Radio } from "@components/Radio.tsx"
import AdditionalServiceCard from "@components/AdditionalServiceCard.tsx"

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
}

interface AdditionalItem {
  id: string
  title: string
  duration: number
  price: number
}

const PaymentPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const [type, setType] = useState<"membership" | "additional">("additional")
  const [items, setItems] = useState<CartItem[] | AdditionalItem[]>([])
  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "simple" | "virtual"
  >("card")
  const [simplePayment, setSimplePayment] = useState<
    "naver" | "kakao" | "payco"
  >("naver")
  const [point, setPoint] = useState<string>("")
  const [isAgreed, setIsAgreed] = useState(false)

  useEffect(() => {
    const dummyAdditionalItems: AdditionalItem[] = [
      {
        id: "1",
        title: "추가 관리 항목명",
        duration: 120,
        price: 100000,
      },
      {
        id: "2",
        title: "추가 관리 항목명",
        duration: 120,
        price: 100000,
      },
    ]

    setItems(dummyAdditionalItems)
  }, [])

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
  }, [])

  const calculateTotalAmount = () => {
    if (type === "membership") {
      const membershipItems = items as CartItem[]
      return membershipItems.reduce((total, item) => {
        return (
          total +
          item.options.reduce(
            (subTotal, option) => subTotal + option.price * option.count,
            0,
          )
        )
      }, 0)
    } else {
      const additionalItems = items as AdditionalItem[]
      return additionalItems.reduce((total, item) => total + item.price, 0)
    }
  }

  const totalAmount = calculateTotalAmount()
  const discountAmount = type === "membership" ? 825600 : 0
  const pointAmount = point ? parseInt(point) : 0
  const finalAmount = totalAmount - discountAmount - pointAmount

  const handleDelete = (id: string) => {
    // TODO: 삭제 로직 구현
    console.log("삭제:", id)
  }

  const handleCountChange = (
    itemId: string,
    optionIndex: number,
    newCount: number,
  ) => {
    // TODO: 수량 변경 로직 구현
    console.log("수량 변경:", itemId, optionIndex, newCount)
  }

  const renderItems = () => {
    if (type === "membership") {
      return (items as CartItem[]).map((item) => (
        <CartCard
          key={item.id}
          {...item}
          onCountChange={(optionIndex, newCount) =>
            handleCountChange(item.id, optionIndex, newCount)
          }
          onDelete={() => handleDelete(item.id)}
        />
      ))
    }

    return (items as AdditionalItem[]).map((item) => (
      <AdditionalServiceCard
        key={item.id}
        {...item}
        onDelete={() => handleDelete(item.id)}
      />
    ))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-1">
        {/* 상품 목록 섹션 */}
        <div className="p-5">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-gray-700 font-sb text-16px">
              {type === "membership" ? "담은 회원권" : "추가 관리"}
            </span>
            <span className="text-primary font-sb text-16px">
              {items.length}개
            </span>
          </div>
          {renderItems()}
        </div>

        <Divider type="m" />

        {/* 포인트 섹션 */}
        <div className="p-5">
          <h2 className="text-gray-700 font-sb text-16px mb-4">포인트</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="2,000"
              className="flex-1 p-3 border border-gray-100 rounded-xl font-r text-16px"
            />
            <Button
              variantType="secondary"
              sizeType="m"
              onClick={() => setPoint("2000")}
            >
              전액 사용
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-14px font-m">
              사용 가능 포인트
            </span>
            <span className="text-primary text-14px font-m">2,000P</span>
          </div>
        </div>

        <Divider type="m" />

        {/* 결제수단 섹션 */}
        <div className="p-5">
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
                  className={simplePayment === "naver" ? "font-m" : "font-r"}
                >
                  네이버 페이
                </Button>
                <Button
                  variantType={
                    simplePayment === "kakao" ? "primary" : "grayLine"
                  }
                  sizeType="s"
                  onClick={() => setSimplePayment("kakao")}
                  className={simplePayment === "kakao" ? "font-m" : "font-r"}
                >
                  카카오페이
                </Button>
                <Button
                  variantType={
                    simplePayment === "payco" ? "primary" : "grayLine"
                  }
                  sizeType="s"
                  onClick={() => setSimplePayment("payco")}
                  className={simplePayment === "payco" ? "font-m" : "font-r"}
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

        <Divider type="m" />

        {/* 결제 금액 섹션 */}
        <div className="p-5">
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
          <Divider type="s_100" className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-16px font-m">최종결제금액</span>
            <span className="text-gray-700 font-b text-20px">
              {finalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        <Divider type="m" />

        {/* 동의 체크박스 */}
        <div className="p-5">
          <label className="flex items-start gap-3">
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
        <div className="w-full h-[96px]" />
      </div>

      {/* 하단 결제 버튼 */}
      <FixedButtonContainer className={"bg-white"}>
        <Button
          variantType="primary"
          sizeType="l"
          disabled={!isAgreed}
          onClick={() => {
            /* 결제 처리 */
          }}
          className="w-full"
        >
          {finalAmount.toLocaleString()}원 결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default PaymentPage
