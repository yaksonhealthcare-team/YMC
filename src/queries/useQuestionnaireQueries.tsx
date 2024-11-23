import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import {
  fetchUserGeneralQuestionnaireResult,
  fetchUserReservationQuestionnaireResult,
} from "../apis/questionnaire.api.ts"

export const useUserGeneralQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult("general"),
    queryFn: fetchUserGeneralQuestionnaireResult,
  })

export const useUserReservationQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult("reservation"),
    queryFn: fetchUserReservationQuestionnaireResult,
  })
