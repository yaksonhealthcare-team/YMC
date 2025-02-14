import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLayout } from "contexts/LayoutContext"
import { useOverlay } from "contexts/ModalContext"
import { Button } from "@components/Button"

interface QuestionnaireHeaderProps {
  hasChanges: boolean
}

export const QuestionnaireHeader = ({
  hasChanges,
}: QuestionnaireHeaderProps) => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()

  const handleBack = useCallback(() => {
    if (hasChanges) {
      openBottomSheet(
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-2">작성을 취소할까요?</h2>
          <p className="text-gray-500 mb-5">
            지금 나가면 작성하신 내용이 저장되지 않아요
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variantType="primary"
              sizeType="l"
              onClick={() => {
                window.history.go(-2) // 모달의 history entry와 현재 페이지를 모두 뒤로가기
              }}
            >
              나가기
            </Button>
            <Button
              variantType="line"
              sizeType="l"
              onClick={() => {
                closeOverlay()
              }}
            >
              계속 작성하기
            </Button>
          </div>
        </div>,
      )
    } else {
      navigate(-1)
    }
  }, [hasChanges, navigate, openBottomSheet, closeOverlay])

  useEffect(() => {
    setHeader({
      display: true,
      title: "문진작성",
      left: "back",
      onClickBack: handleBack,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation, handleBack])

  return null
}
