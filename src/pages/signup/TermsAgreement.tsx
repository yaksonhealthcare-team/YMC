import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { Button } from "@components/Button"
import { Checkbox } from "@mui/material"
import { useSignup } from "../../contexts/SignupContext.tsx"
import CheckFillCircleIcon from "@components/icons/CheckFillCircleIcon.tsx"

export const TermsAgreement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const socialInfo = location.state?.social
  const { setHeader, setNavigation } = useLayout()
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    location: false,
    marketing: false,
  })

  const { setSignupData } = useSignup()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
      onClickBack: () => {
        sessionStorage.removeItem("socialSignupInfo")
        navigate("/login", { replace: true })
      },
    })
    setNavigation({ display: false })
  }, [navigate, setHeader, setNavigation])

  const handleAllCheck = () => {
    const newValue = !agreements.all
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
      location: newValue,
      marketing: newValue,
    })
  }

  const handleAgreement = (key: keyof typeof agreements) => {
    setAgreements({
      ...agreements,
      [key]: !agreements[key],
    })
  }

  const handleNavigateToNext = () => {
    setSignupData((prev) => ({
      ...prev,
      marketingYn: agreements.marketing,
      ...(socialInfo && {
        social: {
          provider: socialInfo.provider,
          accessToken: socialInfo.accessToken,
        },
      }),
    }))

    navigate("/signup/email", {
      state: {
        social: socialInfo,
      },
    })
  }

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      <h1 className="text-[20px] font-bold leading-[30px] text-[#212121]">
        서비스 이용을 위한
        <br />
        약관에 동의해주세요!
      </h1>

      <div className="flex flex-col gap-6">
        {/* 전체 동의 */}
        <div className="h-[52px] px-4 flex items-center gap-3 bg-[rgba(243,113,101,0.1)] border border-primary rounded-xl">
          <Checkbox
            className="p-0 w-auto h-auto"
            checked={agreements.all}
            onChange={handleAllCheck}
            checkedIcon={<CheckFillCircleIcon />}
            icon={<CheckFillCircleIcon color="#DDDDDD" />}
          />
          <span className="font-semibold text-14px text-primary">
            전체약관 동의
          </span>
        </div>

        <div className="h-[1px] bg-[#ECECEC]" />

        {/* 개별 약관들 */}
        <div className="flex flex-col gap-6">
          <AgreementItem
            title="서비스 이용약관 (필수)"
            checked={agreements.terms}
            onChange={() => handleAgreement("terms")}
            onDetail={() => navigate("/terms")}
          />
          <AgreementItem
            title="개인정보 수집 이용 (필수)"
            checked={agreements.privacy}
            onChange={() => handleAgreement("privacy")}
            onDetail={() => navigate("/privacy")}
          />
          <AgreementItem
            title="위치기반 서비스 이용약관 (필수)"
            checked={agreements.location}
            onChange={() => handleAgreement("location")}
            onDetail={() => navigate("/location")}
          />
          <AgreementItem
            title="마케팅 정보 수신 동의 (선택)"
            checked={agreements.marketing}
            onChange={() => handleAgreement("marketing")}
            onDetail={() => navigate("/marketing")}
          />
        </div>
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={
          !agreements.terms || !agreements.privacy || !agreements.location
        }
        onClick={handleNavigateToNext}
      >
        다음
      </Button>
    </div>
  )
}

type AgreementItemProps = {
  title: string
  checked: boolean
  onChange: () => void
  onDetail: () => void
}

const AgreementItem = ({
  title,
  checked,
  onChange,
  onDetail,
}: AgreementItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        className="p-0 w-auto h-auto"
        checked={checked}
        onChange={onChange}
        checkedIcon={<CheckFillCircleIcon />}
        icon={<CheckFillCircleIcon color="#DDDDDD" />}
      />
      <span className="text-14px text-[#212121]">{title}</span>
      <button onClick={onDetail} className="text-primary text-14px underline">
        상세보기
      </button>
    </div>
  )
}

export default TermsAgreement
