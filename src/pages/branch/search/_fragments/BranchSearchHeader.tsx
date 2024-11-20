import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import { SearchField } from "@components/SearchField.tsx"

interface BranchSearchHeaderProps {
  query: string
  onChange: (value: string) => void
}

const BranchSearchHeader = ({ query, onChange }: BranchSearchHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className={"flex flex-col w-full border-b-8 border-gray-50"}>
      <div className={"flex justify-between items-center px-5 py-3"}>
        <button onClick={() => navigate(-1)}>
          <CaretLeftIcon className={"w-5 h-5"} />
        </button>
        <p className={"font-sb"}>{"지점 검색"}</p>
        <div className={"w-7"} />
      </div>
      <div className={"px-5 pt-5 pb-6"}>
        <SearchField
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"지역 또는 지점명을 입력해주세요."}
        />
      </div>
    </div>
  )
}

export default BranchSearchHeader
