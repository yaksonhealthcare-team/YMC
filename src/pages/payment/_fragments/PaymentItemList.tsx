import { PaymentHistory, PaymentHistoryItem } from "../../../types/Payment.ts"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import { Button } from "@components/Button.tsx"

const PaymentItemCard = ({
  canceled,
  category,
  status,
  name,
  amount,
  price,
  brand,
  branchName,
  onClickShowCancelHistory,
}: {
  canceled: boolean
  category: string
  status: string
  name: string
  amount: string
  price: string
  brand: string
  branchName: string
  onClickShowCancelHistory?: () => void
}) => (
  <div className={"flex flex-col p-5 border border-gray-200 rounded-2xl"}>
    <p
      className={`${canceled ? "text-gray-500" : "text-primary"} text-14px font-m`}
    >
      {status}
    </p>
    <p className={"font-sb mt-3"}>{name}</p>
    <div className={"text-14px flex gap-1 mt-1.5"}>
      <p>{amount}</p>
      <p className={"font-bold"}>{price}</p>
    </div>
    <div className={"mt-3 flex items-center text-gray-500 text-12px gap-1.5"}>
      <StoreIcon />
      <p>{brand}</p>
      <div className={"h-3 w-[1px] bg-gray-200"} />
      <p>{`${branchName} 사용 가능`}</p>
    </div>
    {canceled && category === "membership" && onClickShowCancelHistory && (
      <Button
        className={"mt-4"}
        variantType={"gray"}
        sizeType={"s"}
        onClick={onClickShowCancelHistory}
      >
        {"취소 내역 보기"}
      </Button>
    )}
  </div>
)

const Membership = ({
  category,
  item,
  onClickCancelHistory,
}: {
  category: string
  item: PaymentHistoryItem
  onClickCancelHistory?: () => void
}) => {
  return (
    <PaymentItemCard
      canceled={item.status.includes("취소")}
      category={category}
      onClickShowCancelHistory={onClickCancelHistory}
      {...item}
      amount={`${item.amount}회`}
      price={`${item.price.toLocaleString()}원`}
    />
  )
}

const Additional = ({ payment }: { payment: PaymentHistory }) => {
  return (
    <PaymentItemCard
      canceled={payment.status.includes("취소")}
      category={payment.category}
      status={payment.status}
      name={"추가 관리 항목"}
      amount={`총 ${payment.items.length}개`}
      price={`${payment.items.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}원`}
      brand={payment.items[0].brand}
      branchName={payment.items[0].branchName}
    />
  )
}

const PaymentItemList = ({
  payment,
  onClickShowCancelHistory,
}: {
  payment: PaymentHistory
  onClickShowCancelHistory?: () => void
}) => {
  if (payment.category === "additional") {
    return <Additional payment={payment} />
  }

  return (
    <ul className={"flex flex-col space-y-4"}>
      {payment.items.map((item, idx) => (
        <li key={`${item.index}-${idx}`}>
          <Membership
            category={payment.category}
            item={item}
            onClickCancelHistory={onClickShowCancelHistory}
          />
        </li>
      ))}
    </ul>
  )
}

export default PaymentItemList
