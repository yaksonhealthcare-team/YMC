import { useEffect, useState } from "react"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"

import { Button } from "@components/Button"
import { QuestionItem } from "./_fragments/QuestionItem"

import { Question, QuestionValue } from "types/Questionnaire"
import {
  QuestionnaireFormValues,
  QuestionFieldName,
} from "queries/types/questionnaire.types"

import { useLayout } from "contexts/LayoutContext"
import { useOverlay } from "contexts/ModalContext"
import {
  useCommonQuestionnaire,
  useSubmitCommonQuestionnaire,
} from "queries/useQuestionnaireQueries"
import FixedButtonContainer from "@components/FixedButtonContainer"

interface ValidationErrors {
  [key: QuestionFieldName]: string
}

const getFieldName = (question: Question): QuestionFieldName => {
  return `${question.cssq_idx}_${
    question.options.length > 0 ? "option" : "text"
  }` as QuestionFieldName
}

const GeneralQuestionnaire = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { showAlert } = useOverlay()
  const { data: questions, isLoading } = useCommonQuestionnaire()
  const submitMutation = useSubmitCommonQuestionnaire()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCurrentValid, setIsCurrentValid] = useState(false)

  const handleValidationChange = (isValid: boolean) => {
    setIsCurrentValid(isValid)
  }

  useEffect(() => {
    setHeader({
      display: true,
      title: "공통 문진",
      left: "back",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  const formik = useFormik<QuestionnaireFormValues>({
    initialValues: {} as QuestionnaireFormValues,
    onSubmit: async (values) => {
      try {
        await submitMutation.mutateAsync(values)
        showAlert("문진이 완료되었습니다")
        navigate("/")
      } catch (error) {
        showAlert("문진 제출에 실패했습니다")
      }
    },
  })

  const handleNext = () => {
    if (!questions) return

    const currentQuestion = questions[currentIndex]
    const fieldName = getFieldName(currentQuestion)

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
    return (
      <div className="flex justify-center items-center h-screen">로딩중...</div>
    )
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

export default GeneralQuestionnaire
