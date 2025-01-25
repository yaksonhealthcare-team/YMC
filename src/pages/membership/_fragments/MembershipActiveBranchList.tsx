import BranchCard from "../../../components/BranchCard"
import { Branch } from "types/Branch"
import { useAuth } from "../../../contexts/AuthContext"

interface Props {
  onBranchSelect: (branch: Branch) => void
}

export const MembershipActiveBranchList = ({ onBranchSelect }: Props) => {
  const { user } = useAuth()

  if (!user?.brands?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        이용중인 지점이 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {user.brands.map((branch) => {
        const branchData: Branch = {
          id: branch.id,
          name: branch.brandName,
          address: branch.address || "",
          latitude: 0,
          longitude: 0,
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brandCode: "001",
          brand: "therapist",
        }
        return (
          <button
            key={branch.id}
            onClick={() => onBranchSelect(branchData)}
          >
            <BranchCard name={branch.brandName} address={branch.address || ""} />
          </button>
        )
      })}
    </div>
  )
}
