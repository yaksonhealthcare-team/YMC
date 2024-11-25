import { OptionValue } from "queries/types/questionnaire.types"

export interface QuestionOption {
  csso_idx: string
  option_type: string
  option_text: string
  option_image_url: string
  next_cssq_idx: string
}

export interface Question {
  cssq_idx: string
  question_text: string
  contents_type: string
  answer_type: "S" | "M" | "T"
  options: QuestionOption[]
}

export type QuestionValue = string | OptionValue[]
