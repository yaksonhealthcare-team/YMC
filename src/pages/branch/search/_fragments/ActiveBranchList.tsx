import BranchCard from "@components/BranchCard.tsx"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../contexts/AuthContext.tsx"

const ActiveBranchList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={"px-5 py-6 overflow-y-scroll space-y-4"}>
      <p className={"font-sb"}>{"이용중인 지점"}</p>
      <ul className={"space-y-3"}>
        {(user?.brands ?? []).map((brand, index) => (
          <li
            key={index}
            className={"border border-gray-100 rounded-2xl p-5"}
            onClick={() => {
              // TODO: brand에 b_idx 추가되면 변경할 것
              navigate("/branch/5")
            }}
          >
            <BranchCard name={brand.brandName} address={brand.address} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActiveBranchList
