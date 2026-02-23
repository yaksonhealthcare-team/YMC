import {
  fetchCommonQuestionnaire,
  fetchReservationQuestionnaire,
  fetchUserGeneralQuestionnaireResult,
  fetchUserReservationQuestionnaireResult,
  submitCommonQuestionnaire,
  submitReservationQuestionnaire
} from '@/entities/user/api/questionnaire.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Question, QuestionnaireFormValues, QuestionnaireType } from '@/entities/user/model/questionnaire.types';
import { queryKeys } from '@/shared/constants/queryKeys/query.keys';

// 문진 질문 목록 조회
export const useQuestionnaire = (type: QuestionnaireType) =>
  useQuery<Question[], Error>({
    queryKey: queryKeys.questionnaires.questions(type),
    queryFn: type === 'common' ? fetchCommonQuestionnaire : fetchReservationQuestionnaire,
    enabled: !!type,
    retry: false
  });

// 문진 제출
export const useSubmitQuestionnaire = (type: QuestionnaireType) =>
  useMutation<void, Error, QuestionnaireFormValues>({
    mutationFn: type === 'common' ? submitCommonQuestionnaire : submitReservationQuestionnaire,
    retry: false
  });

// 사용자 일반 문진 결과 조회
export const useUserGeneralQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult('general'),
    queryFn: fetchUserGeneralQuestionnaireResult,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: false
  });

// 사용자 예약 문진 결과 조회
export const useUserReservationQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult('reservation'),
    queryFn: fetchUserReservationQuestionnaireResult,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: false
  });
