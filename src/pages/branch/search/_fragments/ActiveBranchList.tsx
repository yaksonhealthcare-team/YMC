import BranchCard from "@components/BranchCard.tsx"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../contexts/AuthContext.tsx"

const ActiveBranchList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={"py-6 overflow-y-hidden space-y-4"}>
      <p className={"px-5 font-sb"}>{"이용중인 지점"}</p>
      <ul className={"px-5 space-y-3 overflow-y-scroll h-full"}>
        {(user?.brands || []).map((brand, index) => (
          <li
            key={index}
            className={"border border-gray-100 rounded-2xl p-5"}
            onClick={() => {
              navigate(`/branch/${brand.b_idx}`)
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
