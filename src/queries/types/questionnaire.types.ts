export interface OptionValue {
  csso_idx: string
}

export interface QuestionnaireFormValues {
  [key: `${string}_${"text" | "option"}`]: string | OptionValue[]
}

export type QuestionValue = string | OptionValue[] | undefined

export type QuestionFieldName = `${string}_${"text" | "option"}`

export interface QuestionnaireFormValues
  extends Record<QuestionFieldName, string | OptionValue[]> {}

export type QuestionnaireType = "common" | "reservation"
