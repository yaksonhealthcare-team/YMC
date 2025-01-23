import BranchCard from "@components/BranchCard.tsx"
import { useAuth } from "../../../contexts/AuthContext.tsx"
import { useMembershipOptionsStore } from "../../../hooks/useMembershipOptions.ts"
import { useNavigate } from "react-router-dom"
import { Branch } from "../../../types/Branch"

const MembershipActiveBranchList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setSelectedBranch } = useMembershipOptionsStore()

  return (
    <div className={"py-6 overflow-y-hidden space-y-4"}>
      <p className={"px-5 font-sb"}>{"이용중인 지점"}</p>
      <ul className={"px-5 space-y-3 overflow-y-scroll h-full"}>
        {(user?.brands || []).map((brand, index) => {
          const branch: Branch = {
            id: brand.id,
            name: brand.brandName,
            address: brand.address,
            brandCode: brand.brandCode || "",
            latitude: 0,
            longitude: 0,
            canBookToday: false,
            distanceInMeters: null,
            isFavorite: false,
            brand: "therapist",
          }

          return (
            <li
              key={index}
              className={"border border-gray-100 rounded-2xl p-5"}
              onClick={() => {
                setSelectedBranch(branch)
                navigate(-1)
              }}
            >
              <BranchCard name={brand.brandName} address={brand.address} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MembershipActiveBranchList
