import { ChangeEvent, ReactNode, useState } from "react"
import { User } from "../../../types/User.ts"
import KakaoLoginIcon from "@assets/icons/third_party_logo/KakaoLoginIcon.svg?react"
import NaverLoginIcon from "@assets/icons/third_party_logo/NaverLoginIcon.svg?react"
import AppleLoginIcon from "@assets/icons/third_party_logo/AppleLoginIcon.svg?react"
import GoogleLoginIcon from "@assets/icons/third_party_logo/GoogleLoginIcon.svg?react"
import clsx from "clsx"
import { Button } from "@components/Button.tsx"
import { RadioCard } from "@components/RadioCard.tsx"
import { RadioGroup } from "@mui/material"
import CustomTextField from "@components/CustomTextField.tsx"
import Switch from "@components/Switch.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import BottomSheetForm from "./EditProfileBottomSheetForm.tsx"

const LabeledForm = ({
  label,
  className = "",
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) => (
  <div className={"flex flex-col gap-3 items-stretch"}>
    <p className={"font-sb text-gray-500 self-start"}>{label}</p>
    <div className={clsx("w-full font-m text-18px", className)}>{children}</div>
  </div>
)

const FieldWithButton = ({
  fieldValue,
  buttonLabel,
  onClick,
}: {
  fieldValue: string
  buttonLabel: string
  onClick: () => void
}) => (
  <div className={"flex items-center gap-1 h-14"}>
    <div
      className={"border border-gray-100 px-4 py-3.5 rounded-xl w-full h-full"}
    >
      <p className={"text-16px font-r"}>{fieldValue}</p>
    </div>
    <Button className={"px-5 h-full"} variantType={"primary"} onClick={onClick}>
      <p className={"text-nowrap"}>{buttonLabel}</p>
    </Button>
  </div>
)

const ProfileForm = ({ user }: { user: User }) => {
  const [gender, setGender] = useState<"male" | "female">("female")
  const [address, setAddress] = useState({ ...user.address })
  const [marketingAgreed, setMarketingAgreed] = useState(user.marketingAgreed)

  const { openBottomSheet, closeOverlay } = useOverlay()

  const handleChangeGender = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "female") {
      setGender("female")
    } else {
      setGender("male")
    }
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
          onClick={() => {}}
        />
      </LabeledForm>
      <LabeledForm label={"휴대폰 번호"}>
        <FieldWithButton
          fieldValue={user.phone}
          buttonLabel={"변경하기"}
          onClick={() => {}}
        />
      </LabeledForm>
      <LabeledForm label={"생년월일"}>
        <p>{"1999.01.09"}</p>
      </LabeledForm>
      <LabeledForm label={"성별"}>
        <RadioGroup value={gender} onChange={handleChangeGender}>
          <div className={"flex gap-2 items-center"}>
            <RadioCard checked={gender === "female"} value={"female"}>
              <p>{"여자"}</p>
            </RadioCard>
            <RadioCard checked={gender === "male"} value={"male"}>
              <p>{"남자"}</p>
            </RadioCard>
          </div>
        </RadioGroup>
      </LabeledForm>
      <LabeledForm className={"flex flex-col gap-2"} label={"주소"}>
        <FieldWithButton
          fieldValue={user.postalCode}
          buttonLabel={"우편번호 검색"}
          onClick={() => {}}
        />
        <CustomTextField
          value={address.road}
          onChange={(e) => setAddress({ ...address, road: e.target.value })}
        />
        <CustomTextField
          value={address.detail}
          onChange={(e) => setAddress({ ...address, detail: e.target.value })}
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
    </div>
  )
}

export default ProfileForm
