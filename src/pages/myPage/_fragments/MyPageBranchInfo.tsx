import { useNavigate } from "react-router-dom"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { useAuth } from "../../../contexts/AuthContext"

const MyPageBranchInfo = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const hasBranches = user?.brands && user.brands.length > 0

  const getBranchText = () => {
    if (!hasBranches) return "이용중인 지점이 없습니다"
    const suffix =
      user.brands.length > 1 ? ` 외 ${user.brands.length - 1}개` : ""
    return `${user.brands[0].brandName}${suffix}`
  }

  const branchText = getBranchText()

  return (
    <button
      type="button"
      className="p-5 bg-white rounded-2xl border border-gray-100 w-full text-left hover:bg-gray-50 transition-colors"
      onClick={() => navigate("/mypage/active-branch")}
    >
      <div className="flex justify-between items-center">
        <span className="font-m text-14px text-gray-500">이용 중인 지점</span>
        <div className="flex items-center">
          <span
            className={`font-sb text-14px ${hasBranches ? "text-gray-900" : "text-gray-500"}`}
          >
            {branchText}
          </span>
          <CaretRightIcon className="w-3 h-3 ml-1.5" />
        </div>
      </div>
    </button>
  )
}

export default MyPageBranchInfo
