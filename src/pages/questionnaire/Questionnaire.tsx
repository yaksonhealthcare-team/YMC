import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { QuestionItem } from "./_fragments/QuestionItem"
import {
  Question,
  QuestionFieldName,
  QuestionnaireType,
} from "types/Questionnaire"
import LoadingIndicator from "@components/LoadingIndicator"
import { useQuestionnaire } from "hooks/useQuestionnaire"
import { QuestionnaireHeader } from "./_fragments/QuestionnaireHeader"
import { QuestionnaireNavigation } from "./_fragments/QuestionnaireNavigation"

/**
 * 문진 페이지
 *
 * 페이지 진입 시 state로 returnPath와 returnText를 전달해야 합니다.
 * 전달된 정보는 문진 완료 후 이동할 페이지와 버튼 텍스트를 결정하는데 사용됩니다.
 *
 * @example
 * // 마이페이지에서 접근 시
 * navigate("/questionnaire/reservation", {
 *   state: {
 *     returnPath: "/mypage",
 *     returnText: "마이페이지로"
 *   }
 * })
 *
 * // state를 전달하지 않을 경우 기본값:
 * // returnPath: "/"
 * // returnText: "메인 홈으로"
 */

const getFieldName = (question: Question): QuestionFieldName => {
  return `${question.cssq_idx}_${
    question.options.length > 0 ? "option" : "text"
  }` as QuestionFieldName
}

const Questionnaire = ({ type }: { type: QuestionnaireType }) => {
  const location = useLocation()
  const { returnPath = "/", returnText = "메인 홈으로" } = location.state || {}

  const {
    questions,
    isLoading,
    currentIndex,
    isCurrentValid,
    hasChanges,
    totalQuestions,
    currentQuestionNumber,
    formik,
    setIsCurrentValid,
    setHasChanges,
    handleNext,
    handlePrev,
  } = useQuestionnaire({
    type,
    returnPath,
    returnText,
  })

  // 폼 값이 변경될 때마다 hasChanges를 true로 설정
  useEffect(() => {
    const hasValues = Object.values(formik.values).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value),
    )
    setHasChanges(hasValues)
  }, [formik.values, setHasChanges])

  if (isLoading || !questions) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="pb-32">
      <QuestionnaireHeader hasChanges={hasChanges} />
      <div className="p-5">
        <QuestionItem
          question={questions[currentIndex]}
          formik={formik}
          fieldName={getFieldName(questions[currentIndex])}
          onValidationChange={setIsCurrentValid}
        />
      </div>
      <QuestionnaireNavigation
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
        isCurrentValid={isCurrentValid}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}

export default Questionnaire
