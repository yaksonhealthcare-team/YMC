import { FormikProps } from "formik"
import { RadioGroup, TextField } from "@mui/material"
import { Question, QuestionOption } from "types/Questionnaire"
import {
  QuestionnaireFormValues,
  QuestionFieldName,
  OptionValue,
} from "queries/types/questionnaire.types"
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

    // 생년월일 질문
    if (question.cssq_idx === "1") {
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
        return (
          !!currentValue &&
          typeof currentValue === "string" &&
          currentValue.trim().length > 0
        )

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
    if (hasOptionImage) {
      // 이미지가 있는 경우 2열 혹은 3열 정사각형으로 보여주기
      return (
        <>
          <label
            className={clsx(
              "flex flex-col justify-center items-center gap-[15px] aspect-square border rounded-[16px] p-3 cursor-pointer",
              totalOptionCount === 2
                ? "w-[calc(50%-4px)]"
                : "w-[calc(33.33%-8px)]",
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
              type="radio"
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
              type="radio"
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

  const renderQuestion = () => {
    const hasImage = hasOptionImage(question.options)
    switch (question.answer_type) {
      case "S":
        if (question.cssq_idx === "1") {
          // 생년월일 질문
          return (
            <BirthDateInput
              value={(formik.values[fieldName] as string) || ""}
              onChange={(value) => formik.setFieldValue(fieldName, value)}
            />
          )
        }
        if (question.options.length === 0) {
          return (
            <TextField
              name={fieldName}
              value={(formik.values[fieldName] as string) || ""}
              onChange={formik.handleChange}
              placeholder="입력해 주세요"
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
                    borderWidth: 1,
                    borderColor: COLORS.FOCUSED_BORDER,
                  },
                  "& input": {
                    padding: "16px",
                    fontSize: "14px",
                  },
                  "& input::placeholder": {
                    color: COLORS.PLACEHOLDER,
                    opacity: 1,
                  },
                },
              }}
            />
          )
        }
        return (
          <RadioGroup
            name={fieldName}
            value={
              (formik.values[fieldName] as OptionValue[])?.[0]?.csso_idx || ""
            }
            onChange={(e) => handleOptionChange(e.target.value, true)}
            className={"flex gap-2"}
            sx={{
              flexDirection: hasImage ? "column" : "row",
            }}
          >
            {question.options.map((option) =>
              renderOptionItem(
                option,
                hasImage,
                isOptionSelected(option.csso_idx),
                handleOptionChange,
                handleTextChange,
                question.options.length,
              ),
            )}
          </RadioGroup>
        )

      case "M":
        return (
          <div className="flex flex-col gap-1">
            {question.options.map((option) =>
              renderOptionItem(
                option,
                hasImage,
                isOptionSelected(option.csso_idx),
                handleOptionChange,
                handleTextChange,
                question.options.length,
              ),
            )}
          </div>
        )

      case "T":
        return (
          <TextField
            name={fieldName}
            value={(formik.values[fieldName] as string) || ""}
            onChange={formik.handleChange}
            placeholder="입력해 주세요"
            multiline
            rows={4}
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
                  borderWidth: 1,
                  borderColor: COLORS.FOCUSED_BORDER,
                },
                "& textarea": {
                  padding: "16px",
                  fontSize: "14px",
                  minHeight: "120px",
                },
                "& textarea::placeholder": {
                  color: COLORS.PLACEHOLDER,
                  opacity: 1,
                },
              },
            }}
          />
        )

      default:
        return null
    }
  }

  useEffect(() => {
    const isValid = checkValidation()
    onValidationChange(isValid)
  }, [formik.values[fieldName], formik.values[`${fieldName}_text`]])

  return (
    <div className="mb-8">
      <div className="text-primary text-xl font-b leading-[29.6px] mb-10">
        {question.question_text}
      </div>
      {renderQuestion()}
    </div>
  )
}
