import { useNavigate } from "react-router-dom"
import BranchCard from "../../../components/BranchCard"
import { useMembershipOptionsStore } from "../../../hooks/useMembershipOptions"
import { useVisitedStores } from "../../../hooks/useVisitedStores"
import { BranchResponse } from "../../../types/Branch"
import { Branch } from "types/Branch"

export const MembershipActiveBranchList = () => {
  const navigate = useNavigate()
  const { setSelectedBranch } = useMembershipOptionsStore()
  const { data: visitedStores } = useVisitedStores()

  if (!visitedStores?.body?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        이용중인 지점이 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {visitedStores.body.map((branch: BranchResponse) => {
        const branchData: Branch = {
          id: branch.b_idx,
          name: branch.b_name,
          address: branch.addr || "",
          latitude: parseFloat(branch.b_lat || "0"),
          longitude: parseFloat(branch.b_lon || "0"),
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brandCode: branch.brand_code,
          brand: "therapist",
        }
        return (
          <button
            key={branch.b_idx}
            onClick={() => {
              setSelectedBranch(branchData)
              navigate(-1)
            }}
          >
            <BranchCard name={branch.b_name} address={branch.addr || ""} />
          </button>
        )
      })}
    </div>
  )
}
