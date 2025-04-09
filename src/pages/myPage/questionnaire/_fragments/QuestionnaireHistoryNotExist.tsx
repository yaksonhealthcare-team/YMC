import { useNavigate, useLocation } from "react-router-dom"
import DocumentEditIcon from "@assets/icons/DocumentEditIcon.svg?react"
import { Button } from "@components/Button.tsx"

const QuestionnaireHistoryNotExist = ({
  onStartQuestionnaire,
}: {
  onStartQuestionnaire: () => void
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}
  const fromSignup = Boolean(state.fromSignup)

  const handleLater = () => {
    if (fromSignup) {
      navigate("/")
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={"flex flex-col justify-between h-full"}>
      <div className={"flex flex-col"}>
        <DocumentEditIcon className={"mx-5 mt-16 text-primary"} />
        <p className={"mx-5 mt-10 text-20px font-b"}>
          {"작성된 문진이 없어요."}
          <br />
          {"고객님의 상태에 맞는 서비스 제공을 위해 "}
          <br />
          <span className={"text-primary"}>{"문진"}</span>
          {"을 통해 "}
          <span className={"text-primary"}>{"현재 상태"}</span>
          {"를 알려주세요!"}
        </p>
      </div>
      <div
        className={"flex flex-col border-t border-gray-50 px-5 pb-8 pt-3 gap-2"}
      >
        <Button variantType={"text"} onClick={handleLater}>
          {"나중에 등록할래요"}
        </Button>
        <Button variantType={"primary"} onClick={onStartQuestionnaire}>
          {"문진 작성 시작하기"}
        </Button>
      </div>
    </div>
  )
}

export default QuestionnaireHistoryNotExist
