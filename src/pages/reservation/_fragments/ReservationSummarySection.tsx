import { AdditionalManagement } from "types/Membership"
import PriceSummary from "@components/PriceSummary"

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
          amount: Number(service.options?.[0]?.ss_price || 0),
        }))}
        total={{
          label: "총 결제금액",
          amount: totalPrice,
        }}
      />
    </section>
  )
}
