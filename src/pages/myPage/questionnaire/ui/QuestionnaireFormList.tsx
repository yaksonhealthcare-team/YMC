import { QuestionnaireResult } from '@/entities/user/model/questionnaire.types';

const QuestionnaireFormList = ({ questions }: { questions: QuestionnaireResult[] }) => {
  return (
    <ul className={'space-y-8 pb-32'}>
      {questions.map((item, i) => (
        <li key={'item.index_' + i}>
          <div className={'flex flex-col gap-4'}>
            <div className={'flex items-start gap-1 text-primary font-sb'}>
              <p>{'Q.'}</p>
              <p>{`${item.question_text}`}</p>
            </div>
            <div className={'p-5 bg-gray-50 rounded-2xl space-y-2'}>
              {item.options?.length > 0 ? (
                item.answer_type === 'T' || item.answer_type === 'C' ? (
                  <div>{item.options[0].answer_text}</div>
                ) : (
                  item.options
                    .filter((option) => option.answer_text !== undefined && option.answer_text !== '')
                    .map((option, index) => (
                      <div key={option.csso_idx || index}>
                        {option.option_text}
                        {index < item.options.length - 1 && ', '}
                      </div>
                    ))
                )
              ) : (
                <div className="text-gray-400">{'응답 내용이 없습니다.'}</div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default QuestionnaireFormList;
