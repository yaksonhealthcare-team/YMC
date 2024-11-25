import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { QuestionnaireResultDTO } from "../types/dtos/QuestionnaireDTO.ts"
import { QuestionnaireMapper } from "../types/dtos/mapper/QuestionnaireMapper.ts"

export const fetchUserGeneralQuestionnaireResult = async () => {
  const { data } = await axiosClient.get<
    HTTPResponse<QuestionnaireResultDTO[]>
  >("/consultations/common/me")
  return QuestionnaireMapper.toQuestionnaireResultEntities(data.body)
}

export const fetchUserReservationQuestionnaireResult = async () => {
  const { data } = await axiosClient.get<
    HTTPResponse<QuestionnaireResultDTO[]>
  >("consultations/reservation/me")
  return QuestionnaireMapper.toQuestionnaireResultEntities(data.body)
}
