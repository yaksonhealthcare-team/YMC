import InformationIcon from '@/assets/icons/InformationIcon.svg?react';
import BranchCard from '@/components/BranchCard';
import { Button } from '@/components/Button';
import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useEffect } from 'react';

interface InformationBottomSheetProps {
  onClose: () => void;
}

const InformationBottomSheet = ({ onClose }: InformationBottomSheetProps) => (
  <div className="flex flex-col">
    <p className="font-sb text-18px mt-5">이용 지점 변경 안내</p>
    <p className="mt-2">
      지점 및 회원권 이동은 현재 이용 지점에
      <br />
      유선으로 문의하여 주세요.
    </p>
    <div className="mt-10 h-[1px] bg-gray-50 w-full" />
    <div className="flex gap-2 w-full justify-stretch my-3 px-5">
      <Button className="w-full" variantType="primary" onClick={onClose}>
        <p>확인</p>
      </Button>
    </div>
  </div>
);

const ActiveBranch = () => {
  const { setHeader, setNavigation } = useLayout();
  const { openBottomSheet, closeOverlay } = useOverlay();
  const { user, isLoading } = useAuth();

  const handleClickInformation = () => {
    openBottomSheet(<InformationBottomSheet onClose={closeOverlay} />);
  };

  useEffect(() => {
    setHeader({
      display: true,
      title: '이용 중인 지점',
      left: 'back',
      right: <InformationIcon onClick={handleClickInformation} />,
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user?.brands?.length) {
    return (
      <div className="h-screen bg-white p-5">
        <EmptyCard title="이용 중인 지점이 없습니다." />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-5">
      <ul className="space-y-3">
        {user.brands.map((branch) => (
          <li key={branch.b_idx} className="p-5 rounded-2xl border border-gray-100">
            <BranchCard name={branch.brandName} address={branch.address} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveBranch;
