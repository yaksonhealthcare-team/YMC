import { MembershipProgram } from "../../../../types/MembershipProgram.ts"
import { Tag } from "@components/Tag.tsx"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"

interface CareProgramCardProps {
  program: MembershipProgram,
}

const CareProgramCard = ({ program }: CareProgramCardProps) => {
  return (
    <div className={"flex flex-col p-5 bg-white shadow-md rounded-2xl gap-3"}>
      <div className={"flex justify-between items-center"}>
        <Tag type={"rect"} title={program.branchScope} />
        {program.duration && (
          <div className={"flex gap-1 items-center"}>
            <ClockIcon className={"text-primary"} />
            <p className={"font-r text-sm text-gray-500"}>{program.duration}</p>
          </div>
        )}
      </div>
      <div className={"flex flex-col gap-1"}>
        <p className={"font-r text-sm"}>{program.brand}</p>
        <p className={"font-sb text-16px"}>{program.name}</p>
      </div>
      {program.options && program.options.length > 0 && (
        <div className={"flex justify-end"}>
          <p className={"font-b text-16px"}>
            {`${program.options[0].price}원 `}
            <span className={"text-xs font-r"}>부터~</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default CareProgramCard
