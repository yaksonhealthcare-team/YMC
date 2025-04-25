import { useUserReservationQuestionnaireResult } from "../../../queries/useQuestionnaireQueries.tsx"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { Button } from "@components/Button.tsx"
import QuestionnaireHistoryNotExist from "./_fragments/QuestionnaireHistoryNotExist.tsx"
import { useNavigate } from "react-router-dom"
import QuestionnaireFormList from "./_fragments/QuestionnaireFormList.tsx"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

const ReservationQuestionnaireHistory = () => {
  const { data: questionnaire, isLoading } =
    useUserReservationQuestionnaireResult()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "예약 문진 보기",
      display: (questionnaire?.length || 0) > 0,
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [questionnaire, setHeader, setNavigation])

  if (isLoading) {
    return (
      <LoadingIndicator className="min-h-screen flex items-center justify-center" />
    )
  }

  if (!questionnaire) {
    return (
      <QuestionnaireHistoryNotExist
        onStartQuestionnaire={() =>
          navigate("/questionnaire/reservation", {
            state: {
              returnPath: "/mypage",
              returnText: "마이페이지로",
            },
          })
        }
      />
    )
  }

  if ((questionnaire?.length || 0) === 0) {
    return (
      <QuestionnaireHistoryNotExist
        onStartQuestionnaire={() =>
          navigate("/questionnaire/reservation", {
            state: {
              returnPath: "/mypage",
              returnText: "마이페이지로",
            },
          })
        }
      />
    )
  }

  return (
    <div
      className={
        "flex flex-col justify-stretch w-full h-screen overflow-hidden fixed inset-0 bg-white"
      }
    >
      <div
        className={"flex-grow overflow-y-auto p-5 overscroll-none mt-[48px]"}
      >
        <QuestionnaireFormList questions={questionnaire} />
      </div>
      <div className={"px-5 pb-6 py-3 border-t border-gray-100"}>
        <Button
          className={"w-full"}
          variantType={"primary"}
          onClick={() =>
            navigate("/questionnaire/reservation", {
              state: {
                returnPath: "/mypage",
                returnText: "마이페이지로",
              },
            })
          }
        >
          {"재작성하기"}
        </Button>
      </div>
    </div>
  )
}

export default ReservationQuestionnaireHistory
