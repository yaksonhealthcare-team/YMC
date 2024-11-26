import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { QuestionnaireResultDTO } from "../types/dtos/QuestionnaireDTO.ts"
import { QuestionnaireMapper } from "../types/dtos/mapper/QuestionnaireMapper.ts"
import { Question } from "../types/Questionnaire"
import { QuestionnaireFormValues } from "../queries/types/questionnaire.types"

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

export const fetchCommonQuestionnaire = async (): Promise<Question[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Question[]>>(
    "/consultations/common/common",
  )
  return data.body
}

export const fetchReservationQuestionnaire = async (): Promise<Question[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Question[]>>(
    "/consultations/reservation/reservation",
  )
  return data.body
}

export const submitCommonQuestionnaire = async (
  formData: QuestionnaireFormValues,
): Promise<void> => {
  await axiosClient.put("/consultations/common/common", formData)
}

export const submitReservationQuestionnaire = async (
  formData: QuestionnaireFormValues,
): Promise<void> => {
  await axiosClient.put("/consultations/reservation/reservation", formData)
}
