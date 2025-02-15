import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "contexts/AuthContext"
import { useOverlay } from "contexts/ModalContext"
import { Button } from "@components/Button"
import { useWithdrawal } from "queries/useAuthQueries"

const WithdrawalPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { openModal } = useOverlay()
  const [isAgreed, setIsAgreed] = useState(false)
  const { mutateAsync: withdrawal } = useWithdrawal()

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원탈퇴",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const handleWithdrawal = async () => {
    if (!isAgreed) {
      openModal({
        title: "안내",
        message: "회원탈퇴 안내에 동의해주세요.",
        onConfirm: () => {},
      })
      return
    }

    try {
      await withdrawal()
      openModal({
        title: "안내",
        message: "회원탈퇴가 완료되었습니다.",
        onConfirm: () => {
          logout()
          navigate("/")
        },
      })
    } catch (error) {
      openModal({
        title: "오류",
        message: "회원탈퇴에 실패했습니다. 다시 시도해주세요.",
        onConfirm: () => {},
      })
    }
  }

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-700 text-16px font-sb">회원탈퇴 안내</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-14px font-r whitespace-pre-line">
            {`• 탈퇴 시 모든 회원 정보가 삭제되며 복구할 수 없습니다.
• 진행 중인 예약이 있는 경우 탈퇴가 불가능합니다.
• 보유하신 회원권과 포인트는 모두 소멸되며 환불되지 않습니다.
• 작성하신 리뷰는 삭제되지 않습니다.`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1"
            style={{
              appearance: "none",
              width: "20px",
              minWidth: "20px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: isAgreed ? "#F37165" : "white",
              border: isAgreed ? "1px solid #F37165" : "1px solid #DDDDDD",
              backgroundImage: isAgreed
                ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                : "none",
            }}
          />
          <span className="text-gray-700 text-14px font-r">
            회원탈퇴 안내를 모두 확인하였으며, 이에 동의합니다.
          </span>
        </label>

        <Button
          variantType="primary"
          sizeType="l"
          onClick={handleWithdrawal}
          disabled={!isAgreed}
        >
          회원탈퇴
        </Button>
      </div>
    </div>
  )
}

export default WithdrawalPage
