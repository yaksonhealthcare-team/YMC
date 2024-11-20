import BranchCard from "@components/BranchCard.tsx"
import { useNavigate } from "react-router-dom"

interface BranchSearchResultListProps {
  query: string
}

// TODO: API 확인 후 추가 구현 예정입니다. (branches API에서 search 파라미터 요청 시 오류)
const BranchSearchResultList = ({ query }: BranchSearchResultListProps) => {
  const navigate = useNavigate()

  return (
    <ul className={"divide-y divide-gray-100 px-5 overflow-y-scroll"}>
      {Array.from({ length: 20 }, (_, index) => (
        <li
          key={index}
          className={"py-4"}
          onClick={() => {
            navigate(`/branch/${index}`)
          }}
        >
          <BranchCard
            name={`약손명가 ${query}점`}
            address={"서울특별시 강남구 테헤란로78길 14-10"}
          />
        </li>
      ))}
    </ul>
  )
}

export default BranchSearchResultList
