import { useLayout } from "../../contexts/LayoutContext.tsx"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import ProfileImageButton from "./_fragments/ProfileImageButton.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import KakaoLoginIcon from "@assets/icons/third_party_logo/KakaoLoginIcon.svg?react"
import NaverLoginIcon from "@assets/icons/third_party_logo/NaverLoginIcon.svg?react"
import AppleLoginIcon from "@assets/icons/third_party_logo/AppleLoginIcon.svg?react"
import GoogleLoginIcon from "@assets/icons/third_party_logo/GoogleLoginIcon.svg?react"
import BottomSheetForm from "./_fragments/EditProfileBottomSheetForm.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import { RadioGroup } from "@mui/material"
import { RadioCard } from "@components/RadioCard.tsx"
import CustomTextField from "@components/CustomTextField.tsx"
import Switch from "@components/Switch.tsx"
import {
  FieldWithButton,
  LabeledForm,
} from "./_fragments/ProfileFormComponents.tsx"
import { updateUserProfile } from "../../apis/auth.api.ts"
import PostcodeModal from "@components/modal/PostcodeModal.tsx"
import { UpdateUserProfileRequest } from "../../types/User.ts"
import { fetchUser } from "../../apis/auth.api.ts"

const EditProfile = () => {
  const { user, login } = useAuth()
  const { setNavigation, setHeader } = useLayout()
  const { openBottomSheet, closeOverlay, showToast } = useOverlay()
  const navigate = useNavigate()

  const [gender, setGender] = useState<"male" | "female">(
    user?.gender === "M" ? "male" : "female",
  )
  const [address, setAddress] = useState({
    ...user!.address,
    postalCode: user!.postalCode,
  })
  const [marketingAgreed, setMarketingAgreed] = useState(user!.marketingAgreed)
  const [openPostcode, setOpenPostcode] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    user?.profileURL,
  )
  const detailAddressFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setHeader({
      left: "back",
      title: "내 정보 수정",
      component: (
        <div className="h-12 flex items-center justify-between px-5 bg-white relative">
          <button onClick={handleClickBackButton} className="absolute left-5">
            <CaretLeftIcon />
          </button>
          <span className="font-sb text-18px flex-1 text-center">
            내 정보 수정
          </span>
          <button
            className={
              "font-m text-gray-500 disabled:text-gray-300 disabled:cursor-default absolute right-5"
            }
            onClick={handleSubmit}
          >
            <p>{"저장"}</p>
          </button>
        </div>
      ),
      backgroundColor: "bg-white",
      display: true,
      onClickBack: handleClickBackButton,
    })
    setNavigation({ display: false })
  }, [address, marketingAgreed, gender, profileImageUrl])

  if (!user) {
    return <></>
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      const updatedData: UpdateUserProfileRequest = {
        postalCode: address.postalCode,
        address1: address.road,
        address2: address.detail,
        sex: gender === "male" ? "M" : "F",
        profileUrl: profileImageUrl || "",
        marketingAgreed: marketingAgreed,
      }

      await updateUserProfile(updatedData)

      // 최신 사용자 정보 가져오기
      const token = localStorage.getItem("accessToken")
      if (token) {
        const updatedUser = await fetchUser(token)
        login({ user: updatedUser, token: token.replace("Bearer ", "") })
        showToast("프로필이 성공적으로 수정되었습니다.")
        navigate(-1)
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error)
      showToast("프로필 수정에 실패했습니다.")
    }
  }

  const handleImageChange = (file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfileImageUrl(imageUrl)
    } else {
      setProfileImageUrl(undefined)
    }
  }

  const handleChangeGender = (event: ChangeEvent<HTMLInputElement>) => {
    const newGender = event.target.value as "male" | "female"
    setGender(newGender)
  }

  const handleClickBackButton = () => {
    openBottomSheet(
      <BottomSheetForm
        title={"이 페이지를 나가시겠습니까?"}
        content={"수정한 데이터가 저장되지 않습니다."}
        confirmOptions={{
          text: "나가기",
          onClick: () => {
            navigate("/mypage")
            closeOverlay()
          },
        }}
        cancelOptions={{
          text: "취소하기",
          onClick: closeOverlay,
        }}
      />,
    )
  }

  const handleClickWithdrawal = () => {
    openBottomSheet(
      <BottomSheetForm
        title={"회원 탈퇴하시겠습니까?"}
        content={"탈퇴 시 적립금은 소멸되며, 계정 복구가 불가합니다."}
        confirmOptions={{
          text: "탈퇴하기",
          onClick: () => {
            closeOverlay()
            navigate("/profile/withdrawal")
          },
        }}
        cancelOptions={{
          text: "취소하기",
          onClick: closeOverlay,
        }}
      />,
    )
  }

  const renderSocialLoginIcon = () => {
    switch (user.thirdPartyType) {
      case "naver":
        return <NaverLoginIcon />
      case "kakao":
        return <KakaoLoginIcon />
      case "apple":
        return <AppleLoginIcon />
      case "google":
        return <GoogleLoginIcon />
      default:
        return null
    }
  }

  return (
    <div className={"w-full h-full flex flex-col overflow-y-scroll"}>
      <div className={"self-center mt-5"}>
        <ProfileImageButton
          profileImageUrl={profileImageUrl}
          onImageChange={handleImageChange}
        />
      </div>
      <div className={"mx-5 mt-5"}>
        <div className={"flex flex-col gap-10 mb-10"}>
          <LabeledForm label={"이름"}>
            <p>{user.username}</p>
          </LabeledForm>
          <LabeledForm className={"flex justify-between"} label={"이메일"}>
            <p>{user.email}</p>
            <div>{renderSocialLoginIcon()}</div>
          </LabeledForm>
          <LabeledForm label={"비밀번호 변경"}>
            <FieldWithButton
              fieldValue={"********"}
              buttonLabel={"변경하기"}
              buttonClassName="px-5 py-3.5 font-bold rounded-[12px]"
              onClick={() => {
                navigate("/profile/reset-password")
              }}
            />
          </LabeledForm>
          <LabeledForm label={"휴대폰 번호"}>
            <FieldWithButton
              fieldValue={user.phone}
              buttonLabel={"변경하기"}
              buttonClassName="px-5 py-3.5 font-bold rounded-[12px]"
              onClick={() => {
                navigate("/profile/change-phone")
              }}
            />
          </LabeledForm>
          <LabeledForm label={"생년월일"}>
            <p className="text-[18px] font-medium text-gray-900">
              {"1999.01.09"}
            </p>
          </LabeledForm>
          <LabeledForm label={"성별"}>
            <RadioGroup value={gender} onChange={handleChangeGender}>
              <div className={"flex gap-2 items-center"}>
                <RadioCard
                  value={"female"}
                  checked={gender === "female"}
                  className="!h-[52px] !p-4 !rounded-[12px]"
                >
                  <p className="text-[16px] font-semibold">{"여자"}</p>
                </RadioCard>
                <RadioCard
                  value={"male"}
                  checked={gender === "male"}
                  className="!h-[52px] !p-4 !rounded-[12px]"
                >
                  <p className="text-[16px] font-semibold">{"남자"}</p>
                </RadioCard>
              </div>
            </RadioGroup>
          </LabeledForm>
          <LabeledForm className={"flex flex-col gap-2"} label={"주소"}>
            <FieldWithButton
              fieldValue={address.postalCode}
              buttonLabel={"우편번호 검색"}
              buttonClassName="px-[20px] py-3.5 font-bold whitespace-nowrap min-w-[140px] rounded-[12px]"
              onClick={() => setOpenPostcode(true)}
            />
            <div
              className={
                "px-4 py-3 outline outline-1 outline-gray-100 rounded-[12px] flex items-center"
              }
            >
              <p className={"font-r text-[16px] leading-[23px]"}>
                {address.road}
              </p>
            </div>
            <CustomTextField
              ref={detailAddressFieldRef}
              placeholder={"상세주소"}
              value={address.detail}
              onChange={(e) =>
                setAddress({ ...address, detail: e.target.value })
              }
            />
          </LabeledForm>
          <div className={"flex justify-between"}>
            <p className={"font-m"}>{"마케팅 수신 동의"}</p>
            <Switch.IOS
              checked={marketingAgreed}
              onChange={(e) => setMarketingAgreed(e.target.checked)}
            />
          </div>
          <button className={"self-start"} onClick={handleClickWithdrawal}>
            <p className={"underline text-gray-400 text-14px font-m"}>
              {"회원탈퇴"}
            </p>
          </button>
          {openPostcode && (
            <PostcodeModal
              setIsPostcodeOpen={setOpenPostcode}
              handleCompletePostcode={({
                roadAddress,
                jibunAddress,
                userSelectedType,
                zonecode,
              }) => {
                setAddress({
                  road: userSelectedType === "R" ? roadAddress : jibunAddress,
                  detail: "",
                  postalCode: zonecode,
                })
                setOpenPostcode(false)
                detailAddressFieldRef.current?.focus()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProfile
