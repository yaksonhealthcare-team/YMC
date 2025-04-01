import {
  OptionValue,
  Question,
  QuestionFieldName,
  QuestionnaireFormValues,
  QuestionOption,
} from "types/Questionnaire"
import BirthDateInput from "./BirthDateInput"
import { useEffect } from "react"
import clsx from "clsx"
import FilledCheckIcon from "@components/icons/FilledCheckIcon"
import { TextArea } from "@components/TextArea"
import CustomTextField from "@components/CustomTextField"
import { Image } from "@components/common/Image"

interface QuestionItemProps {
  question: Question
  value: QuestionnaireFormValues[QuestionFieldName]
  onChange: (value: QuestionnaireFormValues[QuestionFieldName]) => void
  fieldName: QuestionFieldName
  onValidationChange: (isValid: boolean) => void
}

export const QuestionItem = ({
  question,
  value,
  onChange,
  fieldName,
  onValidationChange,
}: QuestionItemProps) => {
  const isOptionSelected = (optionIdx: string): boolean => {
    const values = (value || []) as OptionValue[]
    return values.some((v) => v.csso_idx === optionIdx)
  }

  const checkValidation = () => {
    const currentValue = value

    if (question.cssq_idx === "1" || question.contents_type === "4") {
      if (!currentValue || typeof currentValue !== "string") return false

      const year = currentValue.substring(0, 4)
      const month = currentValue.substring(4, 6)
      const day = currentValue.substring(6, 8)

      if (!year || !month || !day) return false

      const currentYear = new Date().getFullYear()
      const yearNum = parseInt(year)
      if (yearNum < 1900 || yearNum > currentYear) return false

      const monthNum = parseInt(month)
      if (monthNum < 1 || monthNum > 12) return false

      const dayNum = parseInt(day)
      if (dayNum < 1 || dayNum > 31) return false

      const date = new Date(yearNum, monthNum - 1, dayNum)
      if (date.getMonth() !== monthNum - 1) return false

      return true
    }

    if (question.contents_type === "3") {
      if (!currentValue) return false
      const numValue = Number(currentValue)
      if (isNaN(numValue) || numValue < 0) return false
      return true
    }

    const hasSelectedSubjectiveOption = question.options.some(
      (option) =>
        option.option_type === "2" &&
        (value as OptionValue[])?.some(
          (value) => value.csso_idx === option.csso_idx,
        ),
    )
    if (hasSelectedSubjectiveOption) {
      const textFieldValue = value as string
      if (!textFieldValue || textFieldValue.trim().length === 0) {
        return false
      }
      if (textFieldValue.length > 100) {
        return false
      }
    }

    switch (question.answer_type) {
      case "S":
        if (question.options.length > 0) {
          return Array.isArray(currentValue) && currentValue.length === 1
        }
        return (
          !!currentValue &&
          typeof currentValue === "string" &&
          currentValue.trim().length > 0
        )

      case "M":
        return Array.isArray(currentValue) && currentValue.length > 0

      case "T":
        if (question.contents_type === "3") {
          return true
        }
        return (
          typeof currentValue === "string" && currentValue.trim().length > 0
        )

      case "C": {
        if (!Array.isArray(currentValue) || currentValue.length !== 1)
          return false

        const selectedOption = question.options.find(
          (opt) => opt.csso_idx === currentValue[0].csso_idx,
        )
        if (selectedOption?.option_type === "2") {
          const textValue = value as string
          return !!textValue && textValue.trim().length > 0
        }

        return true
      }

      default:
        return false
    }
  }

  const handleTextChange = (textValue: string) => {
    if (textValue.length <= 100) {
      onChange(textValue)
    }
  }

  const handleOptionChange = (optionIdx: string, checked: boolean) => {
    const currentValues = (value || []) as OptionValue[]
    let newValues: OptionValue[]

    if (question.answer_type === "M") {
      if (checked) {
        newValues = [...currentValues, { csso_idx: optionIdx }]
      } else {
        newValues = currentValues.filter((v) => v.csso_idx !== optionIdx)
      }
    } else {
      newValues = [{ csso_idx: optionIdx }]
    }

    onChange(newValues)
  }

  const renderOptionItem = (
    option: QuestionOption,
    hasOptionImage: boolean,
    checked: boolean,
    onChange: (value: string, checked: boolean) => void,
    onTextChange: (value: string) => void,
    totalOptionCount?: number,
  ) => {
    const inputType = question.answer_type === "M" ? "checkbox" : "radio"

    if (hasOptionImage) {
      return (
        <>
          <label
            className={clsx(
              "flex flex-col justify-center items-center gap-[15px] aspect-square border rounded-[16px] p-3 cursor-pointer",
              totalOptionCount === 2
                ? "w-[calc(50%-4px)]"
                : "w-[calc(33.333%-5.333px)]",
              checked
                ? "border-primary bg-primary bg-opacity-10"
                : "border-gray-100",
            )}
            htmlFor={`option-${option.csso_idx}`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              <Image
                className="max-w-[100%] max-h-[100%] object-contain"
                src={option.option_image_url || "https://placehold.co/600x400"}
                alt={option.option_text}
              />
            </div>
            <input
              type={inputType}
              id={`option-${option.csso_idx}`}
              checked={checked}
              onChange={(e) => onChange(option.csso_idx, e.target.checked)}
              className="sr-only peer"
            />
            <span className="text-sm mx-auto font-semibold text-label peer-checked:text-primary">
              {option.option_text}
            </span>
          </label>
          {option.option_type === "2" && checked && (
            <div className="order-1 w-full">
              <TextArea
                id={`${fieldName}_text`}
                placeholder="주관식 답변을 입력해주세요."
                value={(value as string) || ""}
                onChange={(e) => onTextChange(e.target.value)}
                maxLength={100}
              />
            </div>
          )}
        </>
      )
    } else {
      return (
        <>
          <label
            className={clsx(
              "flex gap-3 w-full border rounded-[12px] p-[15px] cursor-pointer",
              checked
                ? "border-primary bg-primary bg-opacity-10"
                : "border-gray-100",
              totalOptionCount === 2 ? "w-[calc(50%-4px)]" : "w-full",
            )}
            htmlFor={`option-${option.csso_idx}`}
          >
            <FilledCheckIcon className="w-5 h-5" isActive={checked} />
            <input
              type={inputType}
              id={`option-${option.csso_idx}`}
              checked={checked}
              onChange={(e) => onChange(option.csso_idx, e.target.checked)}
              className="sr-only peer"
            />
            <span className="text-sm font-semibold text-gray-500 peer-checked:text-primary">
              {option.option_text}
            </span>
          </label>

          {option.option_type === "2" && checked && (
            <div className="order-1 w-full">
              <TextArea
                id={`${fieldName}_text`}
                placeholder="주관식 답변을 입력해주세요."
                value={(value as string) || ""}
                onChange={(e) => onTextChange(e.target.value)}
                maxLength={100}
              />
            </div>
          )}
        </>
      )
    }
  }

  const hasOptionImage = (options: QuestionOption[]): boolean => {
    return options.some((option) => option.option_image_url)
  }

  const renderBirthDateInput = () => {
    return (
      <BirthDateInput
        value={value as string}
        onChange={handleTextChange}
        onValidationChange={onValidationChange}
      />
    )
  }

  const renderQuestion = () => {
    switch (question.contents_type) {
      case "1":
        return (
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) =>
              renderOptionItem(
                option,
                hasOptionImage(question.options),
                isOptionSelected(option.csso_idx),
                handleOptionChange,
                handleTextChange,
                question.options.length,
              ),
            )}
          </div>
        )

      case "2":
        return (
          <div className="flex flex-col gap-2">
            {question.options.map((option) =>
              renderOptionItem(
                option,
                hasOptionImage(question.options),
                isOptionSelected(option.csso_idx),
                handleOptionChange,
                handleTextChange,
              ),
            )}
          </div>
        )

      case "3":
        return (
          <CustomTextField
            type="number"
            value={value as string}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="숫자를 입력해주세요."
          />
        )

      case "4":
        return renderBirthDateInput()

      default:
        return null
    }
  }

  useEffect(() => {
    const isValid = checkValidation()
    onValidationChange(isValid)
  }, [value, question, onValidationChange])

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold">{question.question_text}</div>
      {renderQuestion()}
    </div>
  )
}

export default QuestionItem
