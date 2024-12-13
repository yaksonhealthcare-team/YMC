import {
  QuestionnaireResult,
  QuestionnaireResultResponse,
} from "../types/Questionnaire.ts"

export class QuestionnaireMapper {
  static toQuestionnaireAnswerType(
    dto: QuestionnaireResultResponse["answer_type"],
  ): QuestionnaireResult["answerType"] {
    switch (dto) {
      case "S":
        return "single_choice"
      case "M":
        return "multiple_choice"
      case "T":
        return "text"
    }
  }

  static toQuestionnaireResultEntity(
    dto: QuestionnaireResultResponse,
  ): QuestionnaireResult {
    return {
      index: Number(dto.cssq_idx),
      question: dto.question_text,
      answerType: this.toQuestionnaireAnswerType(dto.answer_type),
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
