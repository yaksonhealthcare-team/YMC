import { useEffect, useState, useCallback } from "react"
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
import LoadingIndicator from "@components/LoadingIndicator"

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
  const { showToast, openBottomSheet, closeOverlay } = useOverlay()
  const { data: questions, isLoading } = useQuestionnaire(type)
  const submitMutation = useSubmitQuestionnaire(type)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCurrentValid, setIsCurrentValid] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const { returnPath = "/", returnText = "메인 홈으로" } = location.state || {}

  const handleValidationChange = (isValid: boolean) => {
    setIsCurrentValid(isValid)
  }

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
                setHasChanges(false)
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
        showToast("문진 제출에 실패했습니다")
      }
    },
  })

  // 폼 값이 변경될 때마다 hasChanges를 true로 설정
  useEffect(() => {
    const hasValues = Object.values(formik.values).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value),
    )
    setHasChanges(hasValues)
  }, [formik.values])

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
    return <LoadingIndicator className="min-h-screen" />
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="fixed inset-0 bg-white">
      <div className="absolute inset-0 overflow-y-auto pb-[120px] pt-[48px]">
        <div className="max-w-[500px] min-w-[375px] mx-auto">
          <div className="p-5">
            <p className="font-medium text-gray-400 mb-3">
              <span className="font-semibold text-primary">
                {currentIndex + 1}
              </span>
              /{questions.length}
            </p>

            {currentQuestion && (
              <QuestionItem
                question={currentQuestion}
                formik={formik}
                fieldName={getFieldName(currentQuestion)}
                onValidationChange={handleValidationChange}
              />
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-[500px] min-w-[375px] mx-auto p-5 flex gap-2">
          <Button
            className="flex-1 !px-5 !py-3.5"
            variantType="line"
            sizeType="l"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            이전
          </Button>
          <Button
            className="flex-1 !px-5 !py-3.5"
            variantType="primary"
            sizeType="l"
            onClick={handleNext}
            disabled={!isCurrentValid}
          >
            {isLastQuestion ? "완료" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Questionnaire
