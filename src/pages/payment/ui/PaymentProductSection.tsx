import PaymentCard from '@/entities/payment/ui/PaymentCard';
import { CartItemOption } from '@/entities/cart/model/Cart';
import { PaymentItem } from '@/entities/payment/model/Payment';

interface PaymentProductSectionProps {
  items: PaymentItem[];
  onCountChange: (cartId: string, newCount: number) => void;
  onDelete: (cartId: string) => void;
}

const PaymentProductSection = ({ items, onCountChange, onDelete }: PaymentProductSectionProps) => {
  return (
    <div className="p-5">
      <div className="flex items-center gap-1 mb-4">
        <span className="text-gray-700 font-sb text-16px">담은 회원권</span>
        <span className="text-primary font-sb text-16px">{items.length}개</span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const option: CartItemOption = {
            sessions: typeof item.sessions === 'string' ? parseInt(item.sessions) : item.sessions,
            items: [
              {
                cartId: item.ss_idx.toString(),
                count: item.amount
              }
            ],
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            ss_idx: item.ss_idx.toString()
          };

          return (
            <PaymentCard
              key={item.ss_idx}
              brand={item.brand}
              branchType={item.branchType}
              title={item.title}
              duration={typeof item.duration === 'string' ? parseInt(item.duration) : item.duration}
              options={[option]}
              branchName={item.branchName}
              onCountChange={onCountChange}
              onDelete={() => onDelete(item.ss_idx.toString())}
              onDeleteOption={(cartIds) => cartIds.forEach((cartId) => onDelete(cartId))}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PaymentProductSection;
