import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys"
import {
  fetchCommonQuestionnaire,
  fetchReservationQuestionnaire,
  submitCommonQuestionnaire,
  submitReservationQuestionnaire,
} from "../apis/questionnaire.apis"
import { Question } from "../types/Questionnaire"
import {
  QuestionnaireFormValues,
  QuestionnaireType,
} from "./types/questionnaire.types"

export const useQuestionnaire = (type: QuestionnaireType) =>
  useQuery<Question[], Error>({
    queryKey: queryKeys.questionnaire[type],
    queryFn:
      type === "common"
        ? fetchCommonQuestionnaire
        : fetchReservationQuestionnaire,
    enabled: !!type,
  })

export const useSubmitQuestionnaire = (type: QuestionnaireType) =>
  useMutation<void, Error, QuestionnaireFormValues>({
    mutationFn:
      type === "common"
        ? submitCommonQuestionnaire
        : submitReservationQuestionnaire,
  })
