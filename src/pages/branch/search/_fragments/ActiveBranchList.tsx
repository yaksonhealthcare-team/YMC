import BranchCard from "@components/BranchCard.tsx"
import { useNavigate } from "react-router-dom"

// TODO: API 확인 후 추가 구현 예정입니다. (이용 지점 DTO 추가 요청)
const ActiveBranchList = () => {
  const navigate = useNavigate()

  return (
    <div className={"px-5 py-6 overflow-y-scroll space-y-4"}>
      <p className={"font-sb"}>{"이용중인 지점"}</p>
      <ul className={"space-y-3"}>
        <li
          className={"border border-gray-100 rounded-2xl p-5"}
          onClick={() => {
            navigate("/branch/5")
          }}
        >
          <BranchCard
            name={"약손명가 선릉점"}
            address={"서울특별시 강남구 테헤란로78길 14-10 1층"}
          />
        </li>
      </ul>
    </div>
  )
}

export default ActiveBranchList
