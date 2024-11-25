import { axiosClient } from "../queries/clients"
import { HTTPResponse } from "types/dtos/HTTPResponse"
import { Question } from "../types/Questionnaire"
import { QuestionnaireFormValues } from "../queries/types/questionnaire.types"

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
