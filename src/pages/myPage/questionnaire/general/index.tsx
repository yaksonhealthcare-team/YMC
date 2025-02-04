import { useQuery } from "@tanstack/react-query"
import { fetchUserGeneralQuestionnaireResult } from "apis/questionnaire.api"

const QuestionnaireGeneralPage = () => {
  const { isLoading } = useQuery({
    queryKey: ["questionnaires", "user_result", "general"],
    queryFn: fetchUserGeneralQuestionnaireResult,
  })

  if (isLoading) return <div>Loading...</div>

  return <div>{/* data 활용한 렌더링 */}</div>
}

export default QuestionnaireGeneralPage
