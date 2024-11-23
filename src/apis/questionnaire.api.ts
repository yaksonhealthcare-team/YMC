import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { QuestionnaireResultDTO } from "../types/dtos/QuestionnaireDTO.ts"
import { QuestionnaireMapper } from "../types/dtos/mapper/QuestionnaireMapper.ts"

export const fetchUserQuestionnaireResult = async () => {
  const { data } = await axiosClient.get<
    HTTPResponse<QuestionnaireResultDTO[]>
  >("/consultations/common/me")
  return QuestionnaireMapper.toQuestionnaireResultEntities(data.body)
}
