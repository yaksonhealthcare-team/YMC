import { QuestionnaireResult } from "../../Questionnaire.ts"
import { QuestionnaireResultDTO } from "../QuestionnaireDTO.ts"

export class QuestionnaireMapper {
  static toQuestionnaireAnswerType(
    dto: QuestionnaireResultDTO["answer_type"],
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
    dto: QuestionnaireResultDTO,
  ): QuestionnaireResult {
    return {
      index: Number(dto.cssq_idx),
      question: dto.question_text,
      answerType: this.toQuestionnaireAnswerType(dto.answer_type),
      options: dto.options.map((option) => ({
        optionIndex: Number(option.csso_idx),
        optionText: option.option_text,
        answerText: option.answer_text,
      })),
    }
  }

  static toQuestionnaireResultEntities(
    dtos: QuestionnaireResultDTO[],
  ): QuestionnaireResult[] {
    return dtos.map((dto) => this.toQuestionnaireResultEntity(dto))
  }
}
