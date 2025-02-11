import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import MyPageNotice from "./_fragments/MyPageNotice"
import MyPageProfile from "./_fragments/MyPageProfile"
import MyPageBranchInfo from "./_fragments/MyPageBranchInfo"
import MyPagePointMembership from "./_fragments/MyPagePointMembership"
import MyPageMenu from "./_fragments/MyPageMenu"
import MyPageFooter from "./_fragments/MyPageFooter"

const MyPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "마이페이지",
      backgroundColor: "bg-system-bg",
      left: "back",
      onClickBack: () => navigate(-1),
    })
    setNavigation({ display: true })
  }, [navigate])

  return (
    <div className="h-fit bg-[#F8F5F2] pb-8">
      <MyPageNotice />
      <MyPageProfile />
      <div className="px-5 space-y-8">
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
  )
}

export default MyPage
