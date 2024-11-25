import { FormikProps } from "formik"
import CustomTextField from "@components/CustomTextField"
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  Checkbox,
  FormGroup,
  TextField,
} from "@mui/material"
import { OptionValue, QuestionnaireFormValues } from "queries/types/questionnaire.types"
import { Question } from "types/Questionnaire"

interface QuestionItemProps {
  question: Question
  formik: FormikProps<QuestionnaireFormValues>
}

export const QuestionItem = ({ question, formik }: QuestionItemProps) => {
  const fieldName = `${question.cssq_idx}_${question.options.length > 0 ? "option" : "text"}`

  const handleOptionChange = (optionIdx: string, checked: boolean) => {
    const currentValues = Array.isArray(formik.values[fieldName])
      ? (formik.values[fieldName] as OptionValue[])
      : []

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

  const isOptionSelected = (optionIdx: string): boolean => {
    const values = Array.isArray(formik.values[fieldName])
      ? (formik.values[fieldName] as OptionValue[])
      : []
    return values.some((v) => v.csso_idx === optionIdx)
  }

  switch (question.answer_type) {
    case "S":
      if (question.options.length === 0) {
        return (
          <div className="mb-6">
            <p className="mb-3 font-m text-14px text-gray-700">
              {question.question_text}
            </p>
            <CustomTextField
              name={fieldName}
              value={(formik.values[fieldName] as string) || ""}
              onChange={formik.handleChange}
              placeholder="입력해 주세요"
            />
          </div>
        )
      }
      return (
        <div className="mb-6">
          <p className="mb-3 font-m text-14px text-gray-700">
            {question.question_text}
          </p>
          <RadioGroup
            name={fieldName}
            value={
              (formik.values[fieldName] as OptionValue[])?.[0]?.csso_idx || ""
            }
            onChange={(e) => handleOptionChange(e.target.value, true)}
          >
            {question.options.map((option) => (
              <FormControlLabel
                key={option.csso_idx}
                value={option.csso_idx}
                control={<Radio />}
                label={option.option_text}
                className="py-2"
              />
            ))}
          </RadioGroup>
        </div>
      )

    case "M":
      return (
        <div className="mb-6">
          <p className="mb-3 font-m text-14px text-gray-700">
            {question.question_text}
          </p>
          <FormGroup>
            {question.options.map((option) => (
              <FormControlLabel
                key={option.csso_idx}
                control={
                  <Checkbox
                    checked={isOptionSelected(option.csso_idx)}
                    onChange={(e) =>
                      handleOptionChange(option.csso_idx, e.target.checked)
                    }
                  />
                }
                label={option.option_text}
                className="py-2"
              />
            ))}
          </FormGroup>
        </div>
      )

    case "T":
      return (
        <div className="mb-6">
          <p className="mb-3 font-m text-14px text-gray-700">
            {question.question_text}
          </p>
          <div className="p-3 min-h-[120px] border border-gray-200 rounded-xl">
            <TextField
              name={fieldName}
              value={(formik.values[fieldName] as string) || ""}
              onChange={formik.handleChange}
              variant="standard"
              fullWidth
              multiline
              rows={4}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                "& .MuiInputBase-root": {
                  padding: 0,
                },
              }}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}
