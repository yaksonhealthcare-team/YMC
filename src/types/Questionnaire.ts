type QuestionnaireResult = {
  index: number
  question: string
  answerType: "single_choice" | "multiple_choice" | "text"
  options: {
    optionIndex: number
    optionText: string
    answerText: string
  }[]
}

export type { QuestionnaireResult }
