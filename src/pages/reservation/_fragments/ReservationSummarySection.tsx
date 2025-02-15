import { AdditionalManagement } from "types/Membership"
import PriceSummary from "@components/PriceSummary"
import { parsePrice } from "utils/format"

interface ReservationSummarySectionProps {
  additionalServices: AdditionalManagement[]
  totalPrice: number
}

export const ReservationSummarySection = ({
  additionalServices,
  totalPrice,
}: ReservationSummarySectionProps) => {
  return (
    <section>
      <PriceSummary
        items={additionalServices.map((service) => ({
          label: service.s_name,
          amount: parsePrice(service.options?.[0]?.ss_price),
        }))}
        total={{
          label: "총 결제금액",
          amount: totalPrice,
        }}
      />
    </section>
  )
}
