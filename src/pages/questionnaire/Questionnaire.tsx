import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useQuestionnaire } from '@/features/questionnaire-submit/lib/useQuestionnaire';
import { Question, QuestionFieldName, QuestionnaireType } from '@/types/Questionnaire';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QuestionItem } from './ui/QuestionItem';
import { QuestionnaireHeader } from './ui/QuestionnaireHeader';
import { QuestionnaireNavigation } from './ui/QuestionnaireNavigation';

/**
 * 문진 페이지
 *
 * 페이지 진입 시 state로 returnPath와 returnText를 전달해야 합니다.
 * 전달된 정보는 문진 완료 후 이동할 페이지와 버튼 텍스트를 결정하는데 사용됩니다.
 *
 * @example
 * // 마이페이지에서 접근 시
 * navigate("/questionnaire/reservation", {
 *   state: {
 *     returnPath: "/mypage",
 *     returnText: "마이페이지로"
 *   }
 * })
 *
 * // state를 전달하지 않을 경우 기본값:
 * // returnPath: "/"
 * // returnText: "메인 홈으로"
 */

const getFieldName = (question: Question): QuestionFieldName => {
  if (question.answer_type === 'T') {
    return `${question.cssq_idx}_text` as QuestionFieldName;
  }

  return `${question.cssq_idx}_${question.options.length > 0 ? 'option' : 'text'}` as QuestionFieldName;
};

const Questionnaire = ({ type }: { type: QuestionnaireType }) => {
  const location = useLocation();
  const { returnPath = '/', returnText = '메인 홈으로' } = location.state || {};

  const {
    questions,
    isLoading,
    currentIndex,
    isCurrentValid,
    hasChanges,
    totalQuestions,
    currentQuestionNumber,
    formValues,
    handleFieldChange,
    setIsCurrentValid,
    setHasChanges,
    handleNext,
    handlePrev
  } = useQuestionnaire({
    type,
    returnPath,
    returnText
  });

  useEffect(() => {
    const hasValues = Object.values(formValues).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
    setHasChanges(hasValues);
  }, [formValues, setHasChanges]);

  //브라우저 스크롤 되지 않도록 설정
  useEffect(() => {
    // 모든 스크롤 이벤트 및 body 스타일 제어
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';

    return () => {
      // 컴포넌트 언마운트 시 원래대로 복원
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  if (isLoading || !questions) {
    return <LoadingIndicator className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="flex flex-col fixed inset-0 bg-white pt-[56px]">
      <QuestionnaireHeader hasChanges={hasChanges} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 pb-[150px]">
          <QuestionItem
            question={questions[currentIndex]}
            value={formValues[getFieldName(questions[currentIndex])]}
            onChange={(value) => handleFieldChange(getFieldName(questions[currentIndex]), value)}
            fieldName={getFieldName(questions[currentIndex])}
            onValidationChange={setIsCurrentValid}
          />
        </div>
      </div>
      <QuestionnaireNavigation
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
        isCurrentValid={isCurrentValid}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default Questionnaire;
