import { useQuery } from "@tanstack/react-query"

const QuestionnaireGeneralPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["questionnaire", "general"],
    queryFn: fetchGeneralQuestionnaire,
    staleTime: 0, // 항상 새로운 데이터를 가져오도록 설정
    refetchOnMount: "always", // 컴포넌트가 마운트될 때마다 새로 불러오기
  })

  // ... existing code ...
}
