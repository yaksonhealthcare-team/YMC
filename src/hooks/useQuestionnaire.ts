import { useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Question,
  QuestionFieldName,
  QuestionnaireFormValues,
  QuestionnaireType,
} from "types/Questionnaire"
import {
  useQuestionnaire as useQuestionnaireQuery,
  useSubmitQuestionnaire,
} from "queries/useQuestionnaireQueries"
import { useOverlay } from "contexts/ModalContext"

const getFieldName = (question: Question): QuestionFieldName => {
  return `${question.cssq_idx}_${
    question.options.length > 0 ? "option" : "text"
  }` as QuestionFieldName
}

interface UseQuestionnaireProps {
  type: QuestionnaireType
  returnPath?: string
  returnText?: string
}

export const useQuestionnaire = ({
  type,
  returnPath = "/",
  returnText = "메인 홈으로",
}: UseQuestionnaireProps) => {
  const navigate = useNavigate()
  const { showToast } = useOverlay()
  const { data: questions, isLoading } = useQuestionnaireQuery(type)
  const submitMutation = useSubmitQuestionnaire(type)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCurrentValid, setIsCurrentValid] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [navigationStack, setNavigationStack] = useState<number[]>([0])
  const [formValues, setFormValues] = useState<QuestionnaireFormValues>({})

  const handleFieldChange = (
    fieldName: QuestionFieldName,
    value: QuestionnaireFormValues[QuestionFieldName],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
    setHasChanges(true)
  }

  // 실제 답변해야 할 질문 수 계산
  const { totalQuestions, currentQuestionNumber } = useMemo(() => {
    if (!questions) return { totalQuestions: 0, currentQuestionNumber: 0 }

    const answeredQuestions = new Set<string>() // 이미 답변한 질문들의 cssq_idx
    const skipMap = new Map<string, string>() // 각 옵션별 건너뛰기 맵

    // 건너뛰기 맵 생성
    questions.forEach((question) => {
      question.options.forEach((option) => {
        if (option.next_cssq_idx) {
          skipMap.set(option.csso_idx, option.next_cssq_idx)
        }
      })
    })

    // 현재까지의 경로에서 실제 답변해야 할 질문 수 계산
    let count = 0
    let currentNumber = 0
    let idx = 0

    while (idx < questions.length) {
      const question = questions[idx]
      if (answeredQuestions.has(question.cssq_idx)) {
        idx++
        continue
      }

      count++
      if (idx <= currentIndex) {
        currentNumber = count
      }

      // 현재 질문에 대한 답변 확인
      const fieldName = getFieldName(question)
      const answer = formValues[fieldName]

      if (Array.isArray(answer) && answer.length > 0) {
        const selectedOption = question.options.find(
          (opt) => opt.csso_idx === answer[0].csso_idx,
        )

        if (selectedOption?.next_cssq_idx) {
          // 다음 질문으로 건너뛰기
          const nextIdx = questions.findIndex(
            (q) => q.cssq_idx === selectedOption.next_cssq_idx,
          )
          if (nextIdx !== -1) {
            answeredQuestions.add(question.cssq_idx)
            idx = nextIdx
            continue
          }
        }
      }

      answeredQuestions.add(question.cssq_idx)
      idx++
    }

    return {
      totalQuestions: count,
      currentQuestionNumber: currentNumber,
    }
  }, [questions, currentIndex, formValues])

  const handleNext = useCallback(async () => {
    if (!questions) return

    if (currentIndex < questions.length - 1) {
      const currentQuestion = questions[currentIndex]
      const currentFieldName = getFieldName(currentQuestion)
      const currentValue = formValues[currentFieldName]

      let nextQuestionIdx = currentIndex + 1
      if (Array.isArray(currentValue) && currentValue.length > 0) {
        const selectedOption = currentQuestion.options.find(
          (opt) => opt.csso_idx === currentValue[0].csso_idx,
        )

        if (selectedOption?.next_cssq_idx) {
          const targetIndex = questions.findIndex(
            (q) => q.cssq_idx === selectedOption.next_cssq_idx,
          )
          if (targetIndex !== -1) {
            nextQuestionIdx = targetIndex
          }
        }
      }

      // 다음 질문의 필드값 초기화
      const nextQuestion = questions[nextQuestionIdx]
      const nextFieldName = getFieldName(nextQuestion)

      setFormValues((prev) => {
        const next = { ...prev }
        // 숫자 입력 필드인 경우 빈 문자열로 초기화
        if (nextQuestion.contents_type === "3") {
          next[nextFieldName] = ""
        } else {
          // 옵션 선택 필드인 경우 빈 배열로 초기화
          next[nextFieldName] = nextQuestion.options.length > 0 ? [] : ""
        }
        // 주관식 텍스트 필드 초기화
        if (nextQuestion.options.some((opt) => opt.option_type === "2")) {
          next[`${nextFieldName}_text`] = ""
        }
        return next
      })

      setNavigationStack((prev) => [...prev, nextQuestionIdx])
      setCurrentIndex(nextQuestionIdx)
    } else {
      try {
        await submitMutation.mutateAsync(formValues)
        navigate("/questionnaire/complete", {
          state: {
            returnPath,
            returnText,
          },
        })
      } catch (error) {
        showToast("문진 제출에 실패했습니다")
      }
    }
  }, [
    questions,
    currentIndex,
    formValues,
    submitMutation,
    navigate,
    returnPath,
    returnText,
    showToast,
  ])

  const handlePrev = useCallback(() => {
    if (navigationStack.length > 1) {
      // 스택에서 현재 위치 제거하고 이전 위치로 이동
      setNavigationStack((prev) => {
        const newStack = [...prev]
        newStack.pop() // 현재 위치 제거
        const prevIndex = newStack[newStack.length - 1] // 이전 위치
        setCurrentIndex(prevIndex)
        return newStack
      })
    }
  }, [navigationStack])

  return {
    questions,
    isLoading,
    currentIndex,
    isCurrentValid,
    hasChanges,
    totalQuestions,
    currentQuestionNumber,
    formValues,
    handleFieldChange,
    setIsCurrentValid,
    setHasChanges,
    handleNext,
    handlePrev,
  }
}
