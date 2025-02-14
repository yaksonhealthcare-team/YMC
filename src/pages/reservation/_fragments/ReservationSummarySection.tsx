import { AdditionalManagement } from "types/Membership"
import { formatPriceWithUnit } from "utils/format"

interface ReservationSummarySectionProps {
  additionalServices: AdditionalManagement[]
  totalPrice: number
}

export const ReservationSummarySection = ({
  additionalServices,
  totalPrice,
}: ReservationSummarySectionProps) => {
  return (
    <section className="px-5 py-6">
      <p className="font-m text-14px mb-2 text-gray-700">결제 금액</p>
      <div className="flex flex-col gap-3 mt-4">
        {additionalServices.map((service) => (
          <div key={service.s_idx} className="flex justify-between">
            <p className="text-gray-400 text-sm font-medium">
              {service.s_name}
            </p>
            <p className="text-base font-medium">
              {formatPriceWithUnit(service.options?.[0]?.ss_price)}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full h-px bg-gray-100 my-4" />
      <div className="flex justify-between items-center">
        <p className="text-gray-700 text-base font-sb">총 결제금액</p>
        <p className="text-primary text-xl font-bold">
          {formatPriceWithUnit(totalPrice)}
        </p>
      </div>
    </section>
  )
}
