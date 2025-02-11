import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import CartCard from "@components/CartCard.tsx"
import {
  useCartItems,
  useDeleteCartItemsMutation,
  useUpdateCartItemMutation,
} from "../../queries/useCartQueries.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { usePaymentStore } from "../../hooks/usePaymentStore.ts"

const CartPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { data: cartWithSummary, isLoading } = useCartItems()
  const { mutate: removeCartItems } = useDeleteCartItemsMutation()
  const { mutate: updateCartItem } = useUpdateCartItemMutation()
  const { setItems: setPaymentItems, setBranch } = usePaymentStore()

  const items = cartWithSummary?.items || []
  const summary = cartWithSummary?.summary

  useEffect(() => {
    setHeader({
      display: true,
      title: "장바구니",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  const handleUpdateItem = (itemId: string, amount: number) => {
    if (amount === 0) {
      removeCartItems([itemId])
    } else {
      updateCartItem({ cartId: itemId, amount: amount })
    }
  }

  const handleRemoveItems = (itemIds: string[]) => {
    removeCartItems(itemIds)
  }

  const getTotalItemCount = () =>
    items.reduce((prev, acc) => prev + acc.options.length, 0)

  const handlePayment = () => {
    if (!items.length) return

    // 장바구니 아이템을 PaymentStore 형식으로 변환
    const paymentItems = items.flatMap((item) =>
      item.options.map((option) => {
        const b_type: "지정지점" | "전지점" =
          item.branchType === "지점 회원권" ? "지정지점" : "전지점"
        return {
          s_idx: parseInt(item.id),
          ss_idx: parseInt(option.ss_idx),
          b_idx: parseInt(item.branchId),
          brand_code: item.brandCode,
          amount: option.items[0].count,
          b_type,
          title: item.title,
          brand: item.brand,
          branchType: item.branchType,
          duration: item.duration,
          price: option.price,
          originalPrice: option.originalPrice,
          sessions: option.sessions,
        }
      }),
    )

    // 첫 번째 아이템의 지점 정보로 selectedBranch 설정
    const firstItem = items[0]
    const selectedBranch = {
      b_idx: firstItem.branchId,
      brandCode: firstItem.brandCode,
      name: firstItem.brand,
      address: "", // 장바구니 API에서는 지점 주소를 제공하지 않음
      latitude: 0, // 장바구니 API에서는 위도를 제공하지 않음
      longitude: 0, // 장바구니 API에서는 경도를 제공하지 않음
      canBookToday: false,
      distanceInMeters: null,
      isFavorite: false,
      brand: "therapist" as const,
    }

    setPaymentItems(paymentItems)
    setBranch(selectedBranch)
    navigate("/payment")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="p-5">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-gray-700 text-16px font-sb">담은 회원권</span>
            <span className="text-primary text-16px font-sb">
              {getTotalItemCount()}개
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
              onCountChange={(cartId, newCount) => {
                handleUpdateItem(cartId, newCount)
              }}
              onDelete={() =>
                handleRemoveItems(
                  item.options.flatMap((option) =>
                    option.items.flatMap((item) => item.cartId),
                  ),
                )
              }
              onDeleteOption={(cartIds) => handleRemoveItems(cartIds)}
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
                {(summary?.total_origin_price || 0).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-14px font-m">
                상품할인금액
              </span>
              <span className="text-success text-14px font-sb">
                {(
                  (summary?.total_origin_price || 0) -
                  (summary?.total_price || 0)
                ).toLocaleString()}
                원
              </span>
            </div>
            <div className="w-full h-[1px] bg-gray-100 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-16px font-m">
                결제예정금액
              </span>
              <span className="text-gray-700 text-20px font-b">
                {(summary?.total_price || 0).toLocaleString()}원
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
          onClick={handlePayment}
          className={"w-full"}
          disabled={getTotalItemCount() === 0}
        >
          {(summary?.total_price || 0).toLocaleString()}원 결제하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default CartPage
