import { useUserGeneralQuestionnaireResult } from "../../../queries/useQuestionnaireQueries.tsx"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { Button } from "@components/Button.tsx"
import QuestionnaireHistoryNotExist from "./_fragments/QuestionnaireHistoryNotExist.tsx"
import { useNavigate } from "react-router-dom"
import QuestionnaireFormList from "./_fragments/QuestionnaireFormList.tsx"
import { QuestionnaireResult } from "types/Questionnaire.ts"

const GeneralQuestionnaireHistory = () => {
  const [questions, setQuestions] = useState<QuestionnaireResult[]>([])
  const { data: questionnaire } = useUserGeneralQuestionnaireResult()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "공통 문진 보기",
      display: (questionnaire?.length || 0) > 0,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    if (questionnaire) {
      setQuestions(questionnaire)
    }
  }, [questionnaire])

  if (questions.length === 0) {
    return (
      <QuestionnaireHistoryNotExist
        onStartQuestionnaire={() =>
          navigate("/questionnaire/common", {
            state: {
              returnPath: "/mypage",
              returnText: "마이페이지로",
            },
          })
        }
      />
    )
  }

  return (
    <div
      className={"flex flex-col justify-stretch w-full h-full overflow-hidden"}
    >
      <div className={"flex-grow overflow-y-scroll p-5"}>
        <QuestionnaireFormList questions={questions} />
      </div>
      <div className={"px-5 pb-6 py-3 border-t border-gray-100"}>
        <Button
          className={"w-full"}
          variantType={"primary"}
          onClick={() =>
            navigate("/questionnaire/common", {
              state: {
                returnPath: "/mypage",
                returnText: "마이페이지로",
              },
            })
          }
        >
          {"수정하기"}
        </Button>
      </div>
    </div>
  )
}

export default GeneralQuestionnaireHistory
