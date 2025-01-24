import { FormikProps } from "formik"
import { TextField } from "@mui/material"
import {
  OptionValue,
  Question,
  QuestionFieldName,
  QuestionnaireFormValues,
  QuestionOption,
} from "types/Questionnaire"
import { COLORS } from "@constants/ColorConstants"
import { BirthDateInput } from "./BirthDateInput"
import { useEffect } from "react"
import clsx from "clsx"
import FilledCheckIcon from "@components/icons/FilledCheckIcon"
import { TextArea } from "@components/TextArea"

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
  const isOptionSelected = (optionIdx: string): boolean => {
    const values = (formik.values[fieldName] || []) as OptionValue[]
    return values.some((v) => v.csso_idx === optionIdx)
  }

  const checkValidation = () => {
    const currentValue = formik.values[fieldName]

    // 생년월일 입력 검증 (cssq_idx가 1이거나 contents_type이 4인 경우)
    if (question.cssq_idx === "1" || question.contents_type === "4") {
      if (!currentValue || typeof currentValue !== "string") return false

      const year = currentValue.substring(0, 4)
      const month = currentValue.substring(4, 6)
      const day = currentValue.substring(6, 8)

      // 기본 형식 검증
      if (!year || !month || !day) return false

      // 년도 검증
      const currentYear = new Date().getFullYear()
      const yearNum = parseInt(year)
      if (yearNum < 1900 || yearNum > currentYear) return false

      // 월 검증
      const monthNum = parseInt(month)
      if (monthNum < 1 || monthNum > 12) return false

      // 일 검증
      const dayNum = parseInt(day)
      if (dayNum < 1 || dayNum > 31) return false

      // 날짜 유효성 검증
      const date = new Date(yearNum, monthNum - 1, dayNum)
      if (date.getMonth() !== monthNum - 1) return false

      return true
    }

    // 숫자 입력 검증
    if (question.contents_type === "3") {
      if (!currentValue) return false
      const numValue = Number(currentValue)
      if (isNaN(numValue) || numValue < 0) return false
      return true
    }

    // option_type이 "2"인 경우 주관식 답변 유효성 검사
    const hasSelectedSubjectiveOption = question.options.some(
      (option) =>
        option.option_type === "2" &&
        (formik.values[fieldName] as OptionValue[])?.some(
          (value) => value.csso_idx === option.csso_idx,
        ),
    )
    if (hasSelectedSubjectiveOption) {
      const textFieldValue = formik.values[`${fieldName}_text`] as string
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
          // 숫자 입력인 경우는 이미 위에서 검증됨
          return true
        }
        return (
          !!currentValue &&
          typeof currentValue === "string" &&
          currentValue.trim().length > 0
        )

      case "C": {
        // 객관식 + 주관식
        if (!Array.isArray(currentValue) || currentValue.length !== 1)
          return false

        // 선택된 옵션이 주관식(option_type: "2")인 경우 텍스트 입력 확인
        const selectedOption = question.options.find(
          (opt) => opt.csso_idx === currentValue[0].csso_idx,
        )
        if (selectedOption?.option_type === "2") {
          const textValue = formik.values[`${fieldName}_text`] as string
          return !!textValue && textValue.trim().length > 0
        }

        return true
      }

      default:
        return false
    }
  }

  const handleTextChange = (value: string) => {
    formik.setFieldValue(`${fieldName}_text`, value)
  }

  const handleOptionChange = (optionIdx: string, checked: boolean) => {
    const currentValues = (formik.values[fieldName] || []) as OptionValue[]
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

    formik.setFieldValue(fieldName, newValues)
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
      // 이미지가 있는 경우 2열 혹은 3열 정사각형으로 보여주기
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
              <img
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
                value={(formik.values[`${fieldName}_text`] as string) || ""}
                onChange={(e) => onTextChange(e.target.value)}
                maxLength={100}
              />
            </div>
          )}
        </>
      )
    } else {
      // 이미지가 없는 경우 일반 FormControlLabel
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
                value={(formik.values[`${fieldName}_text`] as string) || ""}
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
    return options.some(
      (option) =>
        option.option_image_url !== undefined && option.option_image_url !== "",
    )
  }

  useEffect(() => {
    const isValid = checkValidation()
    onValidationChange(isValid)
  }, [formik.values, fieldName])

  const renderQuestion = () => {
    const hasImage = hasOptionImage(question.options)

    // 생년월일 입력 (cssq_idx가 1이거나 contents_type이 4인 경우)
    if (question.cssq_idx === "1" || question.contents_type === "4") {
      return (
        <BirthDateInput
          value={(formik.values[fieldName] as string) || ""}
          onChange={(value) => formik.setFieldValue(fieldName, value)}
        />
      )
    }

    // 숫자 입력
    if (question.contents_type === "3") {
      return (
        <TextField
          name={fieldName}
          value={formik.values[fieldName] || ""}
          onChange={(e) => {
            const value = e.target.value
            formik.setFieldValue(fieldName, value === "" ? "" : value)
          }}
          placeholder="숫자를 입력해 주세요"
          type="number"
          inputProps={{ min: 0 }}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: COLORS.BORDER,
              },
              "&:hover fieldset": {
                borderColor: COLORS.BORDER,
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY,
              },
            },
          }}
        />
      )
    }

    // 객관식 문항
    if (question.options.length > 0) {
      return (
        <div
          className={clsx(
            "flex flex-wrap gap-2",
            hasImage ? "justify-between" : "flex-col",
          )}
        >
          {question.options.map((option) => {
            const checked = isOptionSelected(option.csso_idx)
            return renderOptionItem(
              option,
              hasImage,
              checked,
              handleOptionChange,
              handleTextChange,
              question.options.length,
            )
          })}
        </div>
      )
    }

    // 일반 텍스트 입력
    return (
      <TextField
        name={fieldName}
        value={(formik.values[fieldName] as string) || ""}
        onChange={formik.handleChange}
        placeholder="입력해 주세요"
        fullWidth
        variant="outlined"
        multiline={question.answer_type === "T"}
        rows={question.answer_type === "T" ? 4 : 1}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": {
              borderColor: COLORS.BORDER,
            },
            "&:hover fieldset": {
              borderColor: COLORS.BORDER,
            },
            "&.Mui-focused fieldset": {
              borderColor: COLORS.PRIMARY,
            },
          },
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-semibold text-gray-700">
        {question.question_text}
      </p>
      {renderQuestion()}
    </div>
  )
}
