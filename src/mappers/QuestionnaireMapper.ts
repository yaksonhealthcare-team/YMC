import {
  QuestionnaireResult,
  QuestionnaireResultResponse,
  QuestionnaireFormValues,
  OptionValue,
} from "../types/Questionnaire.ts"

export class QuestionnaireMapper {
  static toQuestionnaireAnswerType(
    dto: QuestionnaireResultResponse["answer_type"],
  ): QuestionnaireResult["answer_type"] {
    return dto
  }

  static toQuestionnaireResultEntity(
    dto: QuestionnaireResultResponse,
  ): QuestionnaireResult {
    return {
      index: Number(dto.cssq_idx),
      question_text: dto.question_text,
      answer_type: dto.answer_type,
      options: dto.options.map((option) => ({
        csso_idx: option.csso_idx,
        option_text: option.option_text,
        answer_text: option.answer_text,
      })),
    }
  }

  static toQuestionnaireResultEntities(
    dtos: QuestionnaireResultResponse[],
  ): QuestionnaireResult[] {
    return dtos.map((dto) => this.toQuestionnaireResultEntity(dto))
  }

  static toQuestionnaireFormValues(
    questions: QuestionnaireResult[],
  ): QuestionnaireFormValues {
    const formValues: QuestionnaireFormValues = {}

    questions.forEach((question) => {
      const questionId = question.index.toString()

      if (question.answer_type === "T") {
        // 텍스트 입력인 경우 (생년월일, 키, 체중 등)
        formValues[`${questionId}_text`] =
          question.options[0]?.answer_text || ""
      } else if (question.answer_type === "C") {
        // 객관식 + 주관식인 경우
        const selectedOptions = question.options
          .filter((opt) => opt.answer_text)
          .map(
            (opt): OptionValue => ({
              csso_idx: opt.csso_idx,
            }),
          )
        formValues[`${questionId}_option`] = selectedOptions

        // 주관식 답변이 있는 경우
        const textAnswer = question.options.find(
          (opt) => opt.option_type === "2",
        )?.answer_text
        if (textAnswer) {
          formValues[`${questionId}_text`] = textAnswer
        }
      } else {
        // 일반 객관식인 경우 (S, M)
        const selectedOptions = question.options
          .filter((opt) => opt.answer_text)
          .map(
            (opt): OptionValue => ({
              csso_idx: opt.csso_idx,
            }),
          )
        formValues[`${questionId}_option`] = selectedOptions
      }
    })

    return formValues
  }
}
