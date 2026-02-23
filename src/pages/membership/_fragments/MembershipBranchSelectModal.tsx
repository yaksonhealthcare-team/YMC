import { BranchesSchema } from '@/_domain/reservation';
import Header from '@/shared/ui/layout/Header';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect } from 'react';
import MembershipBranchSelectPage from '../MembershipBranchSelectPage';

interface Props {
  onSelect: (branch: BranchesSchema) => void;
  onClose: () => void;
  // memberShipId?: string;
  // brandCode: string;
}

export const MembershipBranchSelectModal = ({ onSelect, onClose /* brandCode, */ /* memberShipId */ }: Props) => {
  const { setNavigation } = useLayout();

  // 모달이 닫힐 때 헤더를 복원
  useEffect(() => {
    // 모달이 열릴 때 네비게이션 숨김
    setNavigation({ display: false });

    return () => {
      // 모달이 닫힐 때는 헤더를 설정하지 않음 (onClose 함수에서 처리)
      // 네비게이션 상태만 명시적으로 false로 설정
      setNavigation({ display: false });
    };
  }, [setNavigation]);

  const handleSelect = (branch: BranchesSchema) => {
    onSelect(branch);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9001]"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="fixed inset-0 bg-white h-full w-full flex flex-col"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="bg-white">
          <Header
            title="지점 선택"
            type="back_title"
            onClickBack={() => {
              // history.back()을 사용하는 대신 직접 onClose 호출
              onClose();
            }}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <MembershipBranchSelectPage
            onSelect={handleSelect}
            // memberShipId={memberShipId}
            // brandCode={brandCode}
          />
        </div>
      </div>
    </div>
  );
};
