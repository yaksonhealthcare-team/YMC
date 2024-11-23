import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchUserQuestionnaireResult } from "../apis/questionnaire.api.ts"

export const useUserQuestionnaireResult = () =>
  useQuery({
    queryKey: queryKeys.questionnaires.userResult(),
    queryFn: fetchUserQuestionnaireResult,
  })
