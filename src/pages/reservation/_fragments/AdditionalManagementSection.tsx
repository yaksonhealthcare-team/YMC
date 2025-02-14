import { AdditionalManagement } from "types/Membership"
import { AdditionalServiceCard } from "@components/AdditionalServiceCard"

interface AdditionalManagementSectionProps {
  additionalManagements: AdditionalManagement[]
  selectedServices: AdditionalManagement[]
  onChangeService: (checked: boolean, service: AdditionalManagement) => void
}

export const AdditionalManagementSection = ({
  additionalManagements,
  selectedServices,
  onChangeService,
}: AdditionalManagementSectionProps) => {
  if (!additionalManagements.length) return null

  return (
    <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
      <p className="font-m text-14px text-gray-700 mb-4">추가관리 (선택)</p>
      <div className="flex flex-col gap-3">
        {additionalManagements.map((option) => {
          const isChecked = selectedServices.some(
            (service) => service.s_idx === option.s_idx,
          )
          return (
            <AdditionalServiceCard
              key={option.s_idx}
              option={option}
              isChecked={isChecked}
              onChangeService={onChangeService}
            />
          )
        })}
      </div>
    </section>
  )
}
