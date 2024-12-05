import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import CartCard from "@components/CartCard.tsx"

interface CartItem {
  id: number
  brand: string
  branchType: "전지점" | "지정 지점"
  title: string
  duration: number
  options: {
    count: number
    sessions: number
    price: number
    originalPrice: number
  }[]
}

const CartPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      brand: "약손명가",
      branchType: "전지점",
      title: "K-BEAUTY 연예인관리",
      duration: 120,
      options: [
        { sessions: 30, count: 1, price: 1032000, originalPrice: 1238400 },
        { sessions: 10, count: 2, price: 1032000, originalPrice: 1238400 },
      ],
    },
    {
      id: 2,
      brand: "달리아 스파",
      branchType: "지정 지점",
      title: "작은 얼굴 관리 (80분)",
      duration: 120,
      options: [
        { sessions: 30, count: 1, price: 1032000, originalPrice: 1238400 },
        { sessions: 10, count: 1, price: 1032000, originalPrice: 1238400 },
      ],
    },
  ])

  useEffect(() => {
    setHeader({
      display: true,
      title: "장바구니",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const handleCountChange = (
    itemId: number,
    sessionIndex: number,
    newCount: number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              options: item.options.map((option, idx) =>
                idx === sessionIndex ? { ...option, count: newCount } : option,
              ),
            }
          : item,
      ),
    )
  }

  const handleRemoveItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const calculateTotalPrice = () => {
    const totalOriginal = items.reduce(
      (sum, item) =>
        sum +
        item.options.reduce(
          (optSum, opt) => optSum + opt.originalPrice * opt.count,
          0,
        ),
      0,
    )

    const totalDiscounted = items.reduce(
      (sum, item) =>
        sum +
        item.options.reduce((optSum, opt) => optSum + opt.price * opt.count, 0),
      0,
    )

    return {
      original: totalOriginal,
      discounted: totalDiscounted,
      discount: totalOriginal - totalDiscounted,
    }
  }

  const totalPrices = calculateTotalPrice()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="p-5">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-gray-700 text-16px font-sb">담은 회원권</span>
            <span className="text-primary text-16px font-sb">
              {items.length}개
            </span>
          </div>

          {items.map((item) => (
            <CartCard
              key={item.id}
              brand={item.brand}
              branchType={item.branchType}
              title={item.title}
              duration={item.duration}
              options={item.options}
              onCountChange={(optionIndex, newCount) =>
                handleCountChange(item.id, optionIndex, newCount)
              }
              onDelete={() => handleRemoveItem(item.id)}
            />
          ))}

          <div className="mt-4 space-y-1">
            <div className="flex gap-1">
              <span className="text-gray-500">*</span>
              <p className="text-gray-500 text-14px font-r">
                상담 예약은 월간 2회까지 이용 가능합니다.
              </p>
            </div>
            <div className="flex gap-1">
              <span className="text-gray-500">*</span>
              <p className="text-gray-500 text-14px font-r">
                관리 프로그램은 회원권 구매 후 예약이 가능합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-50" />

        <div className="p-5">
          <h3 className="text-gray-700 text-16px font-sb mb-4">결제 금액</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">상품 금액</span>
              <span className="text-gray-700 text-14px font-sb">
                {totalPrices.original.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">
                상품할인금액
              </span>
              <span className="text-success text-14px font-sb">
                -{totalPrices.discount.toLocaleString()}원
              </span>
            </div>
            <div className="w-full h-[1px] bg-gray-100 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-16px font-m">
                결제예정금액
              </span>
              <span className="text-gray-700 text-20px font-b">
                {totalPrices.discounted.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-[96px]" />
      </div>

      <FixedButtonContainer className={"bg-white"}>
        <Button
          variantType="primary"
          sizeType="l"
          onClick={() => navigate("/payment")}
          className={"w-full"}
        >
          {totalPrices.discounted.toLocaleString()}원 결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default CartPage
