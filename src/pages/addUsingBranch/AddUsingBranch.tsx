import { postVisitedStore } from '@/apis/user.api';
import { Button } from '@/components/Button';
import { useLayout } from '@/stores/LayoutContext';
import { Branch } from '@/types/Branch';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1SearchBranchList from './Step1SearchBranchList';
import Step2SelectedBranchList from './Step2SelectedBranchList';
import Step3Finish from './Step3Finish';

const AddUsingBranch = () => {
  const navigate = useNavigate();
  const [pageStep, setPageStep] = useState(1);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      title: '이용지점 선택',
      left: 'back',
      backgroundColor: 'bg-white',
      display: pageStep !== 3,
      onClickBack: () => {
        if (pageStep === 1) {
          navigate('/', { replace: true });
        } else {
          setPageStep((prev) => prev - 1);
        }
      }
    });
    setNavigation({ display: false });
  }, [pageStep]);

  const handleSaveVisitedStores = async () => {
    try {
      // 선택된 모든 지점에 대해 visited_store API 호출
      await Promise.all(selectedBranches.map((branch) => postVisitedStore(branch.b_idx)));
      setPageStep(3);
    } catch (error) {
      console.error('방문 지점 저장 실패:', error);
    }
  };

  const handleNextStep = () => {
    if (pageStep === 3) {
      navigate('/questionnaire/common');
      return;
    }

    if (pageStep === 2) {
      handleSaveVisitedStores();
      return;
    }

    setPageStep(pageStep + 1);
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      {pageStep === 1 && (
        <Step1SearchBranchList selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />
      )}
      {pageStep === 2 && <Step2SelectedBranchList selectedBranches={selectedBranches} />}
      {pageStep === 3 && <Step3Finish />}

      <div className="w-full px-[20px] pt-[12px] pb-[30px] bg-[#FFFFFF] border-t border-[#F8F8F8]">
        {pageStep === 3 && (
          <button
            className="w-full bg-transparent text-primary-300 mb-[8px] h-[48px] font-semibold text-[16px]"
            onClick={handleSkip}
          >
            나중에 등록할래요
          </button>
        )}

        <Button className="w-full" onClick={handleNextStep}>
          {pageStep === 1 && '다음'}
          {pageStep === 2 && '회원 정보 연동하기'}
          {pageStep === 3 && '문진 작성하기'}
        </Button>
      </div>
    </>
  );
};

export default AddUsingBranch;
