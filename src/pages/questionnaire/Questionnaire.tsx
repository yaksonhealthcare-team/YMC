import { useEffect, useState } from "react"
import { useFormik } from "formik"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { QuestionItem } from "./_fragments/QuestionItem"
import {
  Question,
  QuestionFieldName,
  QuestionnaireFormValues,
  QuestionnaireType,
} from "types/Questionnaire"

import { useLayout } from "contexts/LayoutContext"
import { useOverlay } from "contexts/ModalContext"
import {
  useQuestionnaire,
  useSubmitQuestionnaire,
} from "queries/useQuestionnaireQueries"
import FixedButtonContainer from "@components/FixedButtonContainer"
import SplashScreen from "@components/Splash"

const getFieldName = (question: Question): QuestionFieldName => {
  return `${question.cssq_idx}_${
    question.options.length > 0 ? "option" : "text"
  }` as QuestionFieldName
}
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

const Questionnaire = ({ type }: { type: QuestionnaireType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setHeader, setNavigation } = useLayout()
  const { showAlert } = useOverlay()
  const { data: questions, isLoading } = useQuestionnaire(type)
  const submitMutation = useSubmitQuestionnaire(type)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCurrentValid, setIsCurrentValid] = useState(false)

  const { returnPath = "/", returnText = "메인 홈으로" } = location.state || {}

  const handleValidationChange = (isValid: boolean) => {
    setIsCurrentValid(isValid)
  }

  useEffect(() => {
    setHeader({
      display: true,
      title: "문진작성",
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  const formik = useFormik<QuestionnaireFormValues>({
    initialValues: {} as QuestionnaireFormValues,
    onSubmit: async (values) => {
      try {
        await submitMutation.mutateAsync(values)
        navigate("/questionnaire/complete", {
          state: {
            returnPath,
            returnText,
          },
        })
      } catch (error) {
        showAlert("문진 제출에 실패했습니다")
      }
    },
  })

  const handleNext = () => {
    if (!questions) return

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      formik.handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  if (isLoading || !questions) {
    return <SplashScreen />
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="p-5 pb-32">
      <p className="font-medium text-gray-400 mb-3">
        <span className="font-semibold text-primary">{currentIndex + 1}</span>/
        {questions.length}
      </p>

      {currentQuestion && (
        <QuestionItem
          question={currentQuestion}
          formik={formik}
          fieldName={getFieldName(currentQuestion)}
          onValidationChange={handleValidationChange}
        />
      )}

      <FixedButtonContainer className="bg-white flex gap-2">
        <Button
          className="flex-1"
          variantType="line"
          sizeType="l"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          이전
        </Button>
        <Button
          className="flex-1"
          variantType="primary"
          sizeType="l"
          onClick={handleNext}
          disabled={!isCurrentValid}
        >
          {isLastQuestion ? "완료" : "다음"}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default Questionnaire
