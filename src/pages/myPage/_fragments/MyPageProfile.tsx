import Profile from "@assets/icons/Profile.svg?react"
import { useAuth } from "../../../contexts/AuthContext"
import { Image } from "@components/common/Image"
import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import { fetchCRMUser } from "@apis/user.api"
import { useOverlay } from "contexts/ModalContext"

const MyPageProfile = () => {
  const { user } = useAuth()
  const { setHeader, setNavigation } = useLayout()
  const { showToast } = useOverlay()
  const [isCRMConnected, setIsCRMConnected] = useState<boolean>(false)

  useEffect(() => {
    setIsCRMConnected(user?.memberConnectYn === "Y")
  }, [user?.memberConnectYn])

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const handleCRMConnect = async () => {
    try {
      if (!user?.name || !user?.phone) {
        throw new Error("사용자 정보가 없습니다")
      }
      const res = await fetchCRMUser(user.name, user.phone)
      if (res.resultCode === "00") {
        showToast("회원 정보가 연동되었습니다")
        setIsCRMConnected(true)
      } else {
        showToast("회원 정보 연동에 실패했습니다. 다시 시도해주세요")
        setIsCRMConnected(false)
      }
    } catch (error) {
      console.error("CRM 사용자 조회 실패:", error)
    }
  }

  return (
    <div className="flex items-center gap-3 py-4">
      <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
        {user?.profileURL ? (
          <Image
            src={user.profileURL}
            alt="프로필"
            className="w-full h-full object-cover"
            useDefaultProfile
          />
        ) : (
          <Profile className="w-8 h-8 text-gray-300" />
        )}
      </div>
      <span className="font-b text-[20px] text-gray-900">
        {user?.username ? `${user.username}님` : "회원님"}
      </span>
      <button
        className={`ml-auto bg-primary disabled:bg-gray-200 text-white px-4 py-2 rounded-full  text-gray-900 font-sb text-sm`}
        onClick={handleCRMConnect}
        disabled={isCRMConnected}
      >
        {isCRMConnected ? "회원 연동 완료" : "회원 정보 연동"}
      </button>
    </div>
  )
}

export default MyPageProfile
