import { useOverlay } from "contexts/ModalContext"
import { useNavigate } from "react-router-dom"

const MyPageFooter = () => {
  const navigate = useNavigate()
  const { openModal } = useOverlay()

  const handleOnClickLogout = () => {
    openModal({
      title: "로그아웃",
      message: "로그아웃 하시겠습니까?",
      onConfirm: () => navigate("/logout"),
      onCancel: () => {},
    })
  }
  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-20">
      <div className="flex items-center gap-3">
        <span
          onClick={() => navigate("/terms")}
          className="font-sb text-14px text-gray-400"
        >
          이용약관
        </span>
        <div className="w-[1px] h-3.5 bg-gray-200" />
        <span
          onClick={handleOnClickLogout}
          className="font-sb text-14px text-gray-400"
        >
          로그아웃
        </span>
      </div>
      <span className="font-r text-12px text-gray-300">v.1.1.4 version</span>
    </div>
  )
}

export default MyPageFooter
