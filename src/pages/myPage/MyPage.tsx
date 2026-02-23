import { Button } from '@/shared/ui/button/Button';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageBranchInfo from './_fragments/MyPageBranchInfo';
import MyPageFooter from './_fragments/MyPageFooter';
import MyPageMenu from './_fragments/MyPageMenu';
import MyPageNotice from './_fragments/MyPageNotice';
import MyPagePointMembership from './_fragments/MyPagePointMembership';
import MyPageProfile from './_fragments/MyPageProfile';

const MyPage = () => {
  const navigate = useNavigate();
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  return (
    <div className="h-full bg-[#F8F5F2]">
      <div className="px-5 pb-[calc(82px+20px)]">
        <MyPageNotice />
        <MyPageProfile />
        <div className="space-y-8">
          <div className="space-y-5">
            <MyPageBranchInfo />
            <MyPagePointMembership />
            <Button variantType="primary" sizeType="m" onClick={() => navigate('/profile')} className="w-full">
              프로필 수정
            </Button>
          </div>
          <MyPageMenu />
          <MyPageFooter />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
