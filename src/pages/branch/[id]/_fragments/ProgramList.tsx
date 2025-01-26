import { useNavigate } from "react-router-dom"
import { useMembershipCategories, useMembershipList } from "queries/useMembershipQueries"
import { MembershipCategory } from "types/Membership"
import { useState } from "react"
import { MembershipCard } from "../../../../pages/membership/_fragments/MembershipCard"
import LoadingIndicator from "@components/LoadingIndicator"

interface ProgramListProps {
  brandCode: string
}

const CareProgramTabItem = ({
  program,
  isSelected,
  onSelect,
}: {
  program: MembershipCategory
  isSelected: boolean
  onSelect: (program: MembershipCategory) => void
}) => {
  const renderBackground = () => {
    if (isSelected) {
      return <div className={"w-[68px] h-[68px] rounded-full bg-primary"} />
    }
    return program.sc_pic ? (
      <img
        src={program.sc_pic}
        alt={"배경"}
        className={"w-[68px] h-[68px] rounded-full object-cover"}
      />
    ) : (
      <div className={"w-[68px] h-[68px] rounded-full bg-gray-600"} />
    )
  }

  return (
    <li
      className={"relative w-[68px] h-[68px] rounded-full cursor-pointer"}
      onClick={() => onSelect(program)}
    >
      {renderBackground()}
      <div
        className={
          "absolute w-[68px] z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
        }
      >
        <p className={"text-xs font-medium text-white text-center"}>
          {program.sc_name}
        </p>
      </div>
    </li>
  )
}

const ProgramList = ({ brandCode }: ProgramListProps) => {
  const navigate = useNavigate()
  const { data: categoriesData } = useMembershipCategories(brandCode)
  const [selectedProgram, setSelectedProgram] = useState<MembershipCategory | null>(null)

  const { data: memberships, isLoading } = useMembershipList(
    brandCode,
    selectedProgram?.sc_code
  )

  if (!categoriesData?.body || categoriesData.body.length === 0) {
    return null
  }

  const handleProgramSelect = (program: MembershipCategory) => {
    setSelectedProgram(program)
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-5">
        {categoriesData.body.map((program) => (
          <CareProgramTabItem
            key={program.sc_code}
            program={program}
            isSelected={selectedProgram?.sc_code === program.sc_code}
            onSelect={handleProgramSelect}
          />
        ))}
      </ul>

      {isLoading ? (
        <LoadingIndicator />
      ) : memberships?.body && memberships.body.length > 0 ? (
        <div className="px-5 space-y-3">
          {memberships.body.map((membership) => (
            <MembershipCard
              key={membership.s_idx}
              membership={membership}
              onClick={() => navigate(`/membership/${membership.s_idx}`)}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 py-4 text-center text-gray-500">
          회원권이 없습니다.
        </div>
      )}
    </div>
  )
}

export default ProgramList
