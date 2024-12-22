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

const EditProfile = () => {
  const { user } = useAuth()
  const { setNavigation, setHeader } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
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
            disabled={address.detail.length === 0}
            onClick={handleSubmit}
          >
            <p>{"저장"}</p>
          </button>
        </div>
      ),
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [address, marketingAgreed])

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
        profileUrl: user.profileURL || "",
        marketingAgreed: marketingAgreed,
      }

      await updateUserProfile(updatedData)
      alert("프로필이 성공적으로 수정되었습니다.")
    } catch (error) {
      console.error("프로필 수정 실패:", error)
      alert("프로필 수정에 실패했습니다.")
    }
  }

  const handleChangeGender = (event: ChangeEvent<HTMLInputElement>) => {
    const newGender = event.target.value as "male" | "female"
    console.log("성별 변경:", newGender)
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
            closeOverlay()
            navigate(-1)
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
          onClick: () => {},
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
        <ProfileImageButton profileImageUrl={user.profileURL} />
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
              onClick={() => {
                navigate("/profile/reset-password")
              }}
            />
          </LabeledForm>
          <LabeledForm label={"휴대폰 번호"}>
            <FieldWithButton
              fieldValue={user.phone}
              buttonLabel={"변경하기"}
              onClick={() => {
                navigate("/profile/change-phone")
              }}
            />
          </LabeledForm>
          <LabeledForm label={"생년월일"}>
            <p>{"1999.01.09"}</p>
          </LabeledForm>
          <LabeledForm label={"성별"}>
            <RadioGroup value={gender} onChange={handleChangeGender}>
              <div className={"flex gap-2 items-center"}>
                <RadioCard value={"female"} checked={gender === "female"}>
                  <p>{"여자"}</p>
                </RadioCard>
                <RadioCard value={"male"} checked={gender === "male"}>
                  <p>{"남자"}</p>
                </RadioCard>
              </div>
            </RadioGroup>
          </LabeledForm>
          <LabeledForm className={"flex flex-col gap-2"} label={"주소"}>
            <FieldWithButton
              fieldValue={address.postalCode}
              buttonLabel={"우편번호 검색"}
              onClick={() => setOpenPostcode(true)}
            />
            <div
              className={
                "px-3.5 py-[16.5px] outline outline-1 outline-gray-100 rounded-xl"
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
