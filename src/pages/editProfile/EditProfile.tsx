import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import ProfileImageButton from "./_fragments/ProfileImageButton.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import ProfileForm from "./_fragments/ProfileForm.tsx"
import BottomSheetForm from "./_fragments/EditProfileBottomSheetForm.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"

const EditProfile = () => {
  const { user } = useAuth()
  const { setNavigation, setHeader } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const navigate = useNavigate()

  useEffect(() => {
    setNavigation({ display: false })
    setHeader({ display: false })
  }, [])

  const handleClickBackButton = () => {
    openBottomSheet(
      <BottomSheetForm
        title={"이 페이지를 나가시겠습니까?"}
        content={"수정한 데이터가 저장되지 않습니다."}
        confirmOptions={{
          text: "나가기",
          onClick: () => navigate(-1),
        }}
        cancelOptions={{
          text: "취소하기",
          onClick: closeOverlay,
        }}
      />,
    )
  }

  if (!user) {
    return <></>
  }

  return (
    <div className={"flex flex-col overflow-hidden"}>
      <div className={"flex justify-between px-5 py-4"}>
        <button className={"w-8"} onClick={handleClickBackButton}>
          <CaretLeftIcon className={"w-5 h-5"} />
        </button>
        <p className={"font-sb"}>{"내 정보 수정"}</p>
        <button className={"w-8"}>
          <p>{"저장"}</p>
        </button>
      </div>
      <div className={"w-full h-full flex flex-col overflow-y-scroll"}>
        <div className={"self-center mt-5"}>
          <ProfileImageButton profileImageUrl={user.profileURL} />
        </div>
        <div className={"mx-5 mt-5"}>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}

export default EditProfile
