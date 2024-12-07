import { ShopIcon } from "@components/icons/ShopIcon.tsx"

interface CartOption {
  sessions: number
  count: number
  price: number
  originalPrice: number
}

interface OrderSummaryCardProps {
  status: "결제완료" | "결제미완료"
  brand: string
  branchType: "전지점" | "지정 지점"
  branchName?: string
  title: string
  options: CartOption[]
}

const OrderSummaryCard = ({
  status,
  brand,
  branchType,
  branchName,
  title,
  options,
}: OrderSummaryCardProps) => {
  return (
    <div className="p-5 bg-white rounded-[20px] border border-gray-100">
      <div className="mb-3">
        <span className="text-primary text-14px font-m">{status}</span>
      </div>

      <p className="text-gray-700 text-16px font-sb mb-1.5">{title}</p>
      <div className="flex gap-1.5 items-baseline">
        <span className="text-gray-700 text-14px font-r">
          {options[0].sessions}회
        </span>
        <span className="text-gray-700 text-14px font-b">
          {options[0].price.toLocaleString()}원
        </span>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        <ShopIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-gray-500 text-12px font-r">{brand}</span>
        {branchName && (
          <>
            <div className="w-[1px] h-3 bg-gray-200 mx-1.5" />
            <span className="text-gray-500 text-12px font-r">{branchName}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderSummaryCard
