import { fetchEncryptDataForNice } from "@apis/pass.api"
import { Button } from "@components/Button"
import CheckFillCircleIcon from "@components/icons/CheckFillCircleIcon.tsx"
import LoadingIndicator from "@components/LoadingIndicator"
import { Checkbox } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { checkByNice } from "../../utils/niceCheck"

window.name = "Parent_window"

export const TermsAgreement = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    location: false,
    marketing: false,
  })
  const [isLoading, setIsLoading] = useState(false)

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
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    }

    // 필수 약관(terms, privacy, location)과 선택 약관(marketing)이 모두 체크되어 있는지 확인
    const allChecked = ["terms", "privacy", "location", "marketing"].every(
      (k) => newAgreements[k as keyof typeof agreements],
    )

    setAgreements({
      ...newAgreements,
      all: allChecked,
    })
  }

  const handleDetailClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/terms${path}`)
  }

  const handleOnClickNext = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const data = await fetchEncryptDataForNice()
      await checkByNice(data)
    } catch (error) {
      console.error("PASS 인증 처리 중 오류 발생:", error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingIndicator />
        <p className="mt-4 text-16px font-medium text-[#212121]">
          본인 인증 정보를 처리 중입니다...
        </p>
      </div>
    )
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
        <div
          className="h-[52px] px-4 flex items-center gap-3 bg-[rgba(243,113,101,0.1)] border border-primary rounded-xl cursor-pointer"
          onClick={handleAllCheck}
        >
          <Checkbox
            className="p-0 w-auto h-auto"
            checked={agreements.all}
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
            onDetail={handleDetailClick("/service")}
          />
          <AgreementItem
            title="개인정보 수집 이용 (필수)"
            checked={agreements.privacy}
            onChange={() => handleAgreement("privacy")}
            onDetail={handleDetailClick("/privacy")}
          />
          <AgreementItem
            title="위치기반 서비스 이용약관 (필수)"
            checked={agreements.location}
            onChange={() => handleAgreement("location")}
            onDetail={handleDetailClick("/location")}
          />
          <AgreementItem
            title="마케팅 정보 수신 동의 (선택)"
            checked={agreements.marketing}
            onChange={() => handleAgreement("marketing")}
            onDetail={handleDetailClick("/marketing")}
          />
        </div>
      </div>

      <Button
        type="submit"
        variantType="primary"
        sizeType="l"
        disabled={
          !agreements.terms || !agreements.privacy || !agreements.location
        }
        onClick={handleOnClickNext}
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
  onDetail: (e: React.MouseEvent) => void
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
