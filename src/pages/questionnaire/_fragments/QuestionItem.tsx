import { useEffect } from "react"
import { FormikProps } from "formik"
import {
  Question,
  QuestionFieldName,
  QuestionnaireFormValues,
} from "types/Questionnaire"
import BirthDateInput from "./BirthDateInput"

interface QuestionItemProps {
  question: Question
  formik: FormikProps<QuestionnaireFormValues>
  fieldName: QuestionFieldName
  onValidationChange: (isValid: boolean) => void
}

export const QuestionItem = ({
  question,
  formik,
  fieldName,
  onValidationChange,
}: QuestionItemProps) => {
  useEffect(() => {
    // 옵션이 없는 경우는 항상 유효하다고 처리
    if (!question.options?.length) {
      onValidationChange(true)
      return
    }

    const value = formik.values[fieldName]
    const isValid = Boolean(
      value && (Array.isArray(value) ? value.length > 0 : value),
    )
    onValidationChange(isValid)
  }, [
    formik.values[fieldName],
    question.options,
    fieldName,
    onValidationChange,
  ])

  // 생년월일 입력 필드인 경우
  if (question.contents_type === "4") {
    return (
      <BirthDateInput
        fieldName={fieldName}
        value={formik.values[fieldName] as string}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    )
  }

  // 나머지는 기존 옵션 선택 UI로 처리
  return (
    <div className="space-y-2">
      {question.options.map((option) => (
        <button
          key={option.csso_idx}
          type="button"
          className={`w-full p-4 text-left border rounded-lg ${
            formik.values[fieldName]?.includes?.(option.csso_idx)
              ? "border-primary text-primary"
              : "border-gray-200"
          }`}
          onClick={() => {
            const currentValue = formik.values[fieldName] || []
            const newValue =
              question.answer_type === "M"
                ? Array.isArray(currentValue)
                  ? currentValue.includes(option.csso_idx)
                    ? currentValue.filter((v) => v !== option.csso_idx)
                    : [...currentValue, option.csso_idx]
                  : [option.csso_idx]
                : option.csso_idx
            formik.setFieldValue(fieldName, newValue)
          }}
        >
          {option.option_text}
        </button>
      ))}
    </div>
  )
}
