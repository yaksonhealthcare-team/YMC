import { BranchesSchema } from '@/_domain/reservation';
import { SearchField } from '@/shared/ui/text-field/SearchField';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MembershipBranchList from './MembershipBranchList';

interface Props {
  onSelect?: (branch: BranchesSchema) => void;
  // memberShipId?: string;
  // brandCode?: string;
}

const MembershipBranchSelectPage = ({ onSelect /* brandCode */ /* memberShipId */ }: Props) => {
  const [query, setQuery] = useState('');
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);
  // const currentBrandCode = brandCode || location.state?.brand_code;

  // 헤더 설정
  useEffect(() => {
    setHeader({
      left: 'back',
      title: '지점 선택',
      backgroundColor: 'bg-white',
      display: true,
      onClickBack: () => {
        navigate(-1);
      }
    });
    setNavigation({ display: false });
  }, [navigate, setHeader, setNavigation]);

  // 브랜드 코드 설정
  // useEffect(() => {
  //   if (location.state?.brand_code !== currentBrandCode) {
  //     navigate(location.pathname, {
  //       replace: true, // 히스토리에 새 항목 추가하지 않고 현재 상태 교체
  //       state: {
  //         ...location.state,
  //         brand_code: currentBrandCode
  //       }
  //     });
  //   }
  // }, [currentBrandCode, location.pathname, location.state, location.state?.brand_code, navigate]);

  return (
    <div className={'flex flex-col h-full'}>
      <div className={'px-5 pt-5 pb-6 border-b-8 border-gray-50'}>
        <SearchField onChange={(e) => setQuery(e.target.value)} placeholder={'지역 또는 지점명을 입력해주세요.'} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <MembershipBranchList onSelect={onSelect} query={debouncedQuery} /* memberShipId={memberShipId} */ />
      </div>
    </div>
  );
};

export default MembershipBranchSelectPage;
