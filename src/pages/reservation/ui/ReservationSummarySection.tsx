import PriceSummary from '@/widgets/price-summary/ui/PriceSummary';
import { AdditionalManagement } from '@/entities/membership/model/Membership';
import { parsePrice } from '@/shared/lib/utils/format';

interface ReservationSummarySectionProps {
  additionalServices: AdditionalManagement[];
  totalPrice: number;
}

export const ReservationSummarySection = ({ additionalServices, totalPrice }: ReservationSummarySectionProps) => {
  return (
    <section>
      <PriceSummary
        items={additionalServices.map((service) => ({
          label: service.s_name,
          amount: parsePrice(service.options?.[0]?.ss_price)
        }))}
        total={{
          label: '총 결제금액',
          amount: totalPrice
        }}
      />
    </section>
  );
};
