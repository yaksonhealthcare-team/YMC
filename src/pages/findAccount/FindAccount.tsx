import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import { fetchEncryptDataForNice } from "../../apis/pass.api.ts"
import { useOverlay } from "../../contexts/ModalContext"
import { AxiosError } from "axios"

window.name = "Parent_window"

const FindAccount = () => {
  const { setHeader, setNavigation } = useLayout()
  const [tab, setTab] = useState<"find-email" | "reset-password">("find-email")
  const navigate = useNavigate()
  const { openAlert } = useOverlay()

  const [m, setM] = useState("")
  const [tokenVersionId, setTokenVersionId] = useState("")
  const [encData, setEncData] = useState("")
  const [integrityValue, setIntegrityValue] = useState("")

  useEffect(() => {
    setHeader({
      display: true,
      title: "계정 찾기",
      left: "back",
      backgroundColor: "bg-white",
    })

    setNavigation({ display: false })
  }, [])

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
          // 본인인증 성공 후 선택된 탭에 따라 이동
          navigate(`/find-account/${tab}`, {
            state: {
              verifiedData: {
                tokenVersionId: data.token_version_id,
                encData: data.enc_data,
                integrityValue: data.integrity_value,
              },
            },
          })
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
  }, [navigate, openAlert, tab])

  const handleTabClick = (path: "find-email" | "reset-password") => {
    setTab(path)
  }

  const handleAuthClick = async (e: React.FormEvent<HTMLFormElement>) => {
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
      onSubmit={handleAuthClick}
    >
      <input type="hidden" name="m" value={m} />
      <input type="hidden" name="token_version_id" value={tokenVersionId} />
      <input type="hidden" name="enc_data" value={encData} />
      <input type="hidden" name="integrity_value" value={integrityValue} />

      <div className="h-[48px] px-5 border-b border-gray-100 flex items-center">
        <div className="relative flex items-center gap-[8px] text-14px font-[600] w-full h-full">
          <div
            onClick={() => handleTabClick("find-email")}
            className={`flex-1 text-center cursor-pointer w-[] ${
              tab === "find-email" ? "text-[#212121]" : "text-[#9E9E9E]"
            }`}
          >
            이메일 찾기
          </div>

          <div
            onClick={() => handleTabClick("reset-password")}
            className={`flex-1 text-center cursor-pointer ${
              tab === "reset-password" ? "text-[#212121]" : "text-[#9E9E9E]"
            }`}
          >
            비밀번호 찾기
          </div>

          <div
            className={`absolute bottom-0 h-[2px] bg-black transition-transform duration-300 ease-in-out ${
              tab === "reset-password"
                ? "translate-x-[calc(100%+8px)]"
                : "translate-x-0"
            } w-[calc(50%-4px)]`}
          />
        </div>
      </div>

      <div className="mt-[80px] px-[20px]">
        <p className="flex flex-col justify-center items-center mt-[28px] font-[600] text-20px text-[#212121]">
          <span>계정을 찾기 위해선</span>
          <span>본인인증이 필요해요</span>
        </p>

        <Button
          type="submit"
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
        >
          본인인증 하러가기
        </Button>
      </div>
    </form>
  )
}

export default FindAccount
