type QuestionnaireResultDTO = {
  cssq_idx: string
  question_text: string
  answer_type: "S" | "M" | "T"
  options: {
    csso_idx: string
    option_text: string
    answer_text: string
  }[]
}

export type { QuestionnaireResultDTO }
