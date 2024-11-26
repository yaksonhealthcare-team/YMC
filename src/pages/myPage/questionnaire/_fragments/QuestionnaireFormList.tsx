import { QuestionnaireResult } from "../../../../types/Questionnaire.ts"

const QuestionnaireFormList = ({
  questions,
}: {
  questions: QuestionnaireResult[]
}) => {
  return (
    <ul className={"space-y-8 pb-32"}>
      {questions.map((item) => (
        <li key={item.index}>
          <div className={"flex flex-col gap-4"}>
            <div className={"flex items-start gap-1 text-primary font-sb"}>
              <p>{"Q."}</p>
              <p>{`${item.question}`}</p>
            </div>
            <div className={"p-5 bg-gray-50 rounded-2xl"}>
              {item.options.map((option) => (
                <div key={option.optionIndex}>
                  {item.answerType === "text" || option.optionText.length === 0
                    ? option.answerText
                    : option.optionText}
                </div>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default QuestionnaireFormList
