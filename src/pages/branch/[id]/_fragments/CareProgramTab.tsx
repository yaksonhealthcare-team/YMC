import { MembershipCategory } from "../../../../types/MembershipCategory.ts"
import { useState } from "react"

const CareProgramTabItem = ({ program, isSelected, onSelect }: {
  program: MembershipCategory,
  isSelected: boolean,
  onSelect: (program: MembershipCategory) => void,
}) => {
  const renderBackground = () => {
    if (isSelected) {
      return <div className={"w-[68px] h-[68px] rounded-full bg-primary"} />
    }
    return program.pictureUrl ?
      <img src={program.pictureUrl} alt={"배경"} className={"w-[68px] h-[68px] rounded-full"} /> :
      <div className={"w-[68px] h-[68px] rounded-full bg-gray-600"} />
  }

  return (
    <li className={"relative w-[68px] h-[68px] rounded-full cursor-pointer"} onClick={() => onSelect(program)}>
      {renderBackground()}
      <div className={"absolute w-[68px] z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"}>
        <p className={"text-xs font-medium text-white text-center"}>{program.name}</p>
      </div>
    </li>
  )
}


interface CareProgramTabProps {
  programs: MembershipCategory[];
}

const CareProgramTab = ({ programs }: CareProgramTabProps) => {
  const [selectedProgram, setSelectedProgram] = useState<MembershipCategory>(programs[0])

  return (
    <ul
      className={"flex overflow-x-scroll mt-6 gap-2 px-5"}
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {programs.map((program) => (
        <CareProgramTabItem
          key={program.code}
          program={program}
          isSelected={selectedProgram.code === program.code}
          onSelect={setSelectedProgram}
        />
      ))}
    </ul>
  )
}

export { CareProgramTab, CareProgramTabItem }
