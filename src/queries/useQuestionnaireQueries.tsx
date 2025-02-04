import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys"
import {
  Question,
  QuestionnaireFormValues,
  QuestionnaireType,
} from "../types/Questionnaire"
import {
  fetchUserGeneralQuestionnaireResult,
  fetchUserReservationQuestionnaireResult,
  fetchCommonQuestionnaire,
  fetchReservationQuestionnaire,
  submitCommonQuestionnaire,
  submitReservationQuestionnaire,
} from "apis/questionnaire.api"

// 문진 질문 목록 조회
export const useQuestionnaire = (type: QuestionnaireType) =>
  useQuery<Question[], Error>({
    queryKey: queryKeys.questionnaires.questions(type),
    queryFn:
      type === "common"
        ? fetchCommonQuestionnaire
        : fetchReservationQuestionnaire,
    enabled: !!type,
  })

// 문진 제출
export const useSubmitQuestionnaire = (type: QuestionnaireType) =>
  useMutation<void, Error, QuestionnaireFormValues>({
    mutationFn:
      type === "common"
        ? submitCommonQuestionnaire
        : submitReservationQuestionnaire,
  })

// 사용자 일반 문진 결과 조회
export const useUserGeneralQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult("general"),
    queryFn: fetchUserGeneralQuestionnaireResult,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  })

// 사용자 예약 문진 결과 조회
export const useUserReservationQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult("reservation"),
    queryFn: fetchUserReservationQuestionnaireResult,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  })
