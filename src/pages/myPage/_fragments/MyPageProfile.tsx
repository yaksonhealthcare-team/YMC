import Profile from "@assets/icons/Profile.svg?react"
import { useAuth } from "../../../contexts/AuthContext"
import { Image } from "@components/common/Image"
import { useEffect } from "react"
import { useLayout } from "contexts/LayoutContext"

const MyPageProfile = () => {
  const { user } = useAuth()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

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
    </div>
  )
}

export default MyPageProfile
