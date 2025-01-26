import { Button } from "@components/Button"
import CheckFillCircleIcon from "@components/icons/CheckFillCircleIcon.tsx"
import { Checkbox } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { fetchEncryptDataForNice } from "../../apis/pass.api.ts"
import { useLayout } from "../../contexts/LayoutContext"
import { useSignup } from "../../contexts/SignupContext.tsx"
import { useOverlay } from "contexts/ModalContext"
import { DecryptRequest, fetchDecryptResult } from "apis/decrypt-result.api"
import { AxiosError } from "axios"

window.name = "Parent_window"

export const TermsAgreement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const socialInfo = location.state?.social
  const { setHeader, setNavigation } = useLayout()
  const { openAlert } = useOverlay()
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    location: false,
    marketing: false,
  })

  const [m, setM] = useState("")
  const [tokenVersionId, setTokenVersionId] = useState("")
  const [encData, setEncData] = useState("")
  const [integrityValue, setIntegrityValue] = useState("")

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

  useEffect(() => {
    const fetchNiceData = async () => {
      try {
        const { body } = await fetchEncryptDataForNice()
        const data = body[0]

        setM(data.m)
        setTokenVersionId(data.token_version_id)
        setEncData(data.enc_data)
        setIntegrityValue(data.integrity_value)
      } catch (error) {
        console.error("NICE 본인인증 데이터 가져오기 실패:", error)
      }
    }

    fetchNiceData()
  }, [])

  // 본인인증 결과 메시지 처리
  useEffect(() => {
    const handlePassVerification = async (event: MessageEvent) => {
      const { type, data, error } = event.data

      if (type === "PASS_VERIFICATION_FAILED") {
        openAlert({
          title: "오류",
          description: error,
        })
        return
      }

      if (type === "PASS_VERIFICATION_DATA") {
        try {
          const request: DecryptRequest = {
            token_version_id: data.token_version_id,
            enc_data: data.enc_data,
            integrity_value: data.integrity_value,
          }

          const response = await fetchDecryptResult(request)
          const userData = response.body

          setSignupData((prev) => ({
            ...prev,
            name: userData.name,
            mobileNumber: userData.hp,
            birthDate: userData.birthdate,
            gender: userData.sex === "M" ? "male" : "female",
            marketingYn: agreements.marketing,
            ...(socialInfo && {
              social: {
                provider: socialInfo.provider,
                accessToken: socialInfo.accessToken,
              },
            }),
          }))
          navigate("/signup/profile")
        } catch (error) {
          const axiosError = error as AxiosError<{ resultMessage: string }>
          openAlert({
            title: "오류",
            description:
              axiosError.response?.data?.resultMessage ||
              "본인인증에 실패했습니다.",
          })
        }
      }
    }

    window.addEventListener("message", handlePassVerification)
    return () => window.removeEventListener("message", handlePassVerification)
  }, [agreements.marketing, navigate, setSignupData, openAlert, socialInfo])

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

  const handleNavigateToNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const popup = window.open(
      "about:blank",
      "popupChk",
      "width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no",
    )

    if (!popup) {
      openAlert({
        title: "알림",
        description: "팝업이 차단되었습니다.",
      })
      return
    }

    e.currentTarget.submit()
  }

  return (
    <form
      action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
      target="popupChk"
      onSubmit={handleNavigateToNext}
    >
      <input type="hidden" name="m" value={m} />
      <input type="hidden" name="token_version_id" value={tokenVersionId} />
      <input type="hidden" name="enc_data" value={encData} />
      <input type="hidden" name="integrity_value" value={integrityValue} />

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
          type="submit"
          variantType="primary"
          sizeType="l"
          disabled={
            !agreements.terms || !agreements.privacy || !agreements.location
          }
        >
          다음
        </Button>
      </div>
    </form>
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
      <Checkbox checked={checked} onChange={onChange} />
      <span className="text-14px text-[#212121]">{title}</span>
      <button onClick={onDetail} className="text-primary text-14px underline">
        상세보기
      </button>
    </div>
  )
}

export default TermsAgreement
