export interface Question {
  cssq_idx: string;
  question_text: string;
  contents_type: string;
  answer_type: 'S' | 'M' | 'T' | 'C';
  options: {
    csso_idx: string;
    option_type: string;
    option_text: string;
    option_image_url: string;
    next_cssq_idx: string;
  }[];
}

export interface QuestionOption {
  csso_idx: string;
  option_type: string;
  option_text: string;
  option_image_url: string;
  next_cssq_idx: string;
}

export type QuestionnaireType = 'common' | 'reservation';

export interface QuestionnaireResult {
  index: number;
  question_text: string;
  answer_type: 'S' | 'M' | 'T' | 'C';
  options: {
    csso_idx: string;
    option_type?: string;
    option_text: string;
    answer_text: string;
  }[];
}

export interface QuestionnaireResultResponse {
  cssq_idx: string;
  question_text: string;
  answer_type: 'S' | 'M' | 'T' | 'C';
  options: {
    csso_idx: string;
    option_text: string;
    answer_text: string;
  }[];
}

export interface OptionValue {
  csso_idx: string;
  text?: string;
}

export interface QuestionnaireFormValues {
  [key: `${string}_${'text' | 'option'}`]: string | OptionValue[];
}

export type QuestionValue = string | OptionValue[] | undefined;

export type QuestionFieldName = `${string}_${'text' | 'option'}`;
