import { useUserQuestionnaireResult } from "../../../queries/useQuestionnaireQueries.tsx"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { Button } from "@components/Button.tsx"
import QuestionnaireHistoryNotExist from "./_fragments/QuestionnaireHistoryNotExist.tsx"
import { useNavigate } from "react-router-dom"

const Questionnaire = () => {
  const { data: questionnaire, isError } = useUserQuestionnaireResult()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  const isQuestionnaireExists = questionnaire && questionnaire.length > 0

  useEffect(() => {
    setHeader({
      left: "back",
      title: "공통 문진 보기",
      display: isQuestionnaireExists,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (!isQuestionnaireExists || isError) {
    return <QuestionnaireHistoryNotExist />
  }

  return (
    <div
      className={"flex flex-col justify-stretch w-full h-full overflow-hidden"}
    >
      <div className={"flex-grow overflow-y-scroll p-5"}>
        <ul className={"space-y-8 pb-32"}>
          {questionnaire?.map((item) => (
            <li key={item.index}>
              <div className={"flex flex-col gap-4"}>
                <p
                  className={"text-primary font-sb"}
                >{`Q. ${item.question}`}</p>
                <div className={"p-5 bg-gray-50 rounded-2xl"}>
                  {item.options.map((option) => (
                    <div key={option.optionIndex}>
                      {item.answerType === "text" ||
                      option.optionText.length === 0
                        ? option.answerText
                        : option.optionText}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={"px-5 pb-6 py-3 border-t border-gray-100"}>
        <Button
          className={"w-full"}
          variantType={"primary"}
          onClick={() => navigate("/questionnaire/general")}
        >
          {"수정하기"}
        </Button>
      </div>
    </div>
  )
}

export default Questionnaire
