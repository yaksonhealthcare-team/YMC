export interface OptionValue {
  csso_idx: string
}

export interface QuestionnaireFormValues {
  [key: string]: string | OptionValue[] // "1_text": string | "1_option": OptionValue[]
}
