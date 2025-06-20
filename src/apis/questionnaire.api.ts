import { axiosClient } from '@/queries/clients';
import { HTTPResponse } from '@/types/HTTPResponse';
import { Question, QuestionnaireFormValues, QuestionnaireResult } from '../types/Questionnaire';

// 사용자 공통 문진 결과 조회
export const fetchUserGeneralQuestionnaireResult = async () => {
  const { data } = await axiosClient.get<HTTPResponse<QuestionnaireResult[]>>('/consultations/common/me');
  return data.body;
};

// 사용자 예약 문진 결과 조회
export const fetchUserReservationQuestionnaireResult = async () => {
  const { data } = await axiosClient.get<HTTPResponse<QuestionnaireResult[]>>('/consultations/reservation/me');
  return data.body;
};

// 공통 문진 제출
export const submitCommonQuestionnaire = async (values: QuestionnaireFormValues) => {
  await axiosClient.put('/consultations/common/common', values);
};

// 예약 문진 제출
export const submitReservationQuestionnaire = async (values: QuestionnaireFormValues) => {
  await axiosClient.put('/consultations/reservation/reservation', values);
};

// 공통 문진 질문 조회
export const fetchCommonQuestionnaire = async () => {
  const { data } = await axiosClient.get<HTTPResponse<Question[]>>('/consultations/common/common');
  return data.body;
};

// 예약 문진 질문 조회
export const fetchReservationQuestionnaire = async () => {
  const { data } = await axiosClient.get<HTTPResponse<Question[]>>('/consultations/reservation/reservation');
  return data.body;
};
