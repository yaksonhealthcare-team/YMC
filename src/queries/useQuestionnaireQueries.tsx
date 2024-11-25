import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys"
import {
  fetchCommonQuestionnaire,
  fetchReservationQuestionnaire,
  submitCommonQuestionnaire,
  submitReservationQuestionnaire,
} from "../apis/questionnaire.apis"
import { Question } from "../types/Questionnaire"
import { QuestionnaireFormValues } from "./types/questionnaire.types"

// 공통 문진 조회
export const useCommonQuestionnaire = () =>
  useQuery<Question[], Error>({
    queryKey: queryKeys.questionnaire.common,
    queryFn: fetchCommonQuestionnaire,
  })

// 예약 문진 조회
export const useReservationQuestionnaire = () =>
  useQuery<Question[], Error>({
    queryKey: queryKeys.questionnaire.reservation,
    queryFn: fetchReservationQuestionnaire,
  })

// 공통 문진 제출
export const useSubmitCommonQuestionnaire = () =>
  useMutation<void, Error, QuestionnaireFormValues>({
    mutationFn: submitCommonQuestionnaire,
  })

// 예약 문진 제출
export const useSubmitReservationQuestionnaire = () =>
  useMutation<void, Error, QuestionnaireFormValues>({
    mutationFn: submitReservationQuestionnaire,
  })
