import {
  QuestionnaireResult,
  QuestionnaireResultResponse,
} from "../types/Questionnaire.ts"

export class QuestionnaireMapper {
  static toQuestionnaireAnswerType(
    dto: QuestionnaireResultResponse["answer_type"],
  ): QuestionnaireResult["answer_type"] {
    switch (dto) {
      case "S":
        return "single_choice"
      case "M":
        return "multiple_choice"
      case "T":
        return "text"
      case "C":
        return "single_choice"
    }
  }

  static toQuestionnaireResultEntity(
    dto: QuestionnaireResultResponse,
  ): QuestionnaireResult {
    return {
      index: Number(dto.cssq_idx),
      question_text: dto.question_text,
      answer_type: this.toQuestionnaireAnswerType(dto.answer_type),
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
}
