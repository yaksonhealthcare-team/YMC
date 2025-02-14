import { Button } from "@components/Button"

interface QuestionnaireNavigationProps {
  currentQuestionNumber: number
  totalQuestions: number
  isCurrentValid: boolean
  onPrev: () => void
  onNext: () => void
}

export const QuestionnaireNavigation = ({
  currentQuestionNumber,
  totalQuestions,
  isCurrentValid,
  onPrev,
  onNext,
}: QuestionnaireNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 text-sm">
          {currentQuestionNumber} / {totalQuestions}
        </span>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{
                width: `${(currentQuestionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          variantType="line"
          sizeType="l"
          onClick={onPrev}
          className="flex-1"
          disabled={currentQuestionNumber === 1}
        >
          이전
        </Button>
        <Button
          variantType="primary"
          sizeType="l"
          onClick={onNext}
          className="flex-1"
          disabled={!isCurrentValid}
        >
          {currentQuestionNumber === totalQuestions ? "완료" : "다음"}
        </Button>
      </div>
    </div>
  )
}
