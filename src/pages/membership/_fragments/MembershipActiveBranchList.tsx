import BranchCard from "../../../components/BranchCard"
import { Branch } from "types/Branch"
import { useAuth } from "../../../contexts/AuthContext"
import { useLocation } from "react-router-dom"
import { BranchInfo } from "../../../types/Membership"
import { useMemo } from "react"

interface Props {
  onBranchSelect: (branch: Branch) => void
}

export const MembershipActiveBranchList = ({ onBranchSelect }: Props) => {
  const { user } = useAuth()
  const location = useLocation()

  // 사용 가능한 지점 목록
  const availableBranches: BranchInfo[] =
    location.state?.availableBranches || []

  // 사용자의 활성 지점과 사용 가능한 지점을 필터링
  const filteredBranches = useMemo(() => {
    if (!user?.brands?.length) return []

    if (availableBranches.length === 0) {
      return user.brands // 사용 가능한 지점 목록이 없으면 모든 활성 지점 표시
    }

    // 사용자의 활성 지점 중 사용 가능한 지점만 필터링
    return user.brands.filter((brand) =>
      availableBranches.some(
        (availableBranch: BranchInfo) => availableBranch.b_idx === brand.b_idx,
      ),
    )
  }, [user?.brands, availableBranches])

  if (!filteredBranches.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        이용 가능한 지점이 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {filteredBranches.map((branch) => {
        const branchData: Branch = {
          b_idx: branch.b_idx,
          name: branch.brandName,
          address: branch.address || "",
          latitude: 0,
          longitude: 0,
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brandCode: branch.brandCode,
          brand: "therapist",
        }
        return (
          <button key={branch.b_idx} onClick={() => onBranchSelect(branchData)}>
            <BranchCard
              name={branch.brandName}
              address={branch.address || ""}
            />
          </button>
        )
      })}
    </div>
  )
}
