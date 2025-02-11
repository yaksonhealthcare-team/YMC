import PaymentCard from "@components/PaymentCard.tsx"
import { CartItemOption } from "../../../types/Cart"

interface PaymentProductSectionProps {
  paymentItems: Array<{
    ss_idx: number | string
    brand: string
    branchType: string
    title: string
    duration: number | string
    sessions: number | string
    price: number
    originalPrice?: number
    amount: number
  }>
  onCountChange: (cartId: string, newCount: number) => void
  onDelete: (cartId: string) => void
}

const PaymentProductSection = ({
  paymentItems,
  onCountChange,
  onDelete,
}: PaymentProductSectionProps) => {
  return (
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
            duration={
              typeof item.duration === "string"
                ? parseInt(item.duration)
                : item.duration
            }
            options={[
              {
                items: [
                  {
                    cartId: item.ss_idx.toString(),
                    count: item.amount,
                  },
                ],
                sessions:
                  typeof item.sessions === "string"
                    ? parseInt(item.sessions)
                    : item.sessions,
                price: item.price,
                originalPrice: item.originalPrice || item.price,
                ss_idx: item.ss_idx.toString(),
              } satisfies CartItemOption,
            ]}
            onCountChange={(cartId, newCount) =>
              onCountChange(cartId, newCount)
            }
            onDelete={() => onDelete(item.ss_idx.toString())}
            onDeleteOption={(cartIds) =>
              cartIds.forEach((cartId) => onDelete(cartId))
            }
          />
        ))}
      </div>
    </div>
  )
}

export default PaymentProductSection
