import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import LoadingIndicator from "@components/LoadingIndicator"
import MyPageNotice from "./_fragments/MyPageNotice"
import MyPageProfile from "./_fragments/MyPageProfile"
import MyPageBranchInfo from "./_fragments/MyPageBranchInfo"
import MyPagePointMembership from "./_fragments/MyPagePointMembership"
import MyPageMenu from "./_fragments/MyPageMenu"
import MyPageFooter from "./_fragments/MyPageFooter"
import { useAuth } from "../../contexts/AuthContext"

const MyPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { isLoading } = useAuth()

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: true })
  }, [])

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="h-fit bg-[#F8F5F2] pb-8">
      <div className="px-5">
        <MyPageNotice />
        <MyPageProfile />
        <div className="space-y-8">
          <div className="space-y-5">
            <MyPageBranchInfo />
            <MyPagePointMembership />
            <Button
              variantType="primary"
              sizeType="m"
              onClick={() => navigate("/profile")}
              className="w-full"
            >
              프로필 수정
            </Button>
          </div>
          <MyPageMenu />
          <MyPageFooter />
        </div>
      </div>
    </div>
  )
}

export default MyPage
