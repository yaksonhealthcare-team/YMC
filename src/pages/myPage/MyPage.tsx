import { Button } from '@/shared/ui/button/Button';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageBranchInfo from './ui/MyPageBranchInfo';
import MyPageFooter from './ui/MyPageFooter';
import MyPageMenu from './ui/MyPageMenu';
import MyPageNotice from './ui/MyPageNotice';
import MyPagePointMembership from './ui/MyPagePointMembership';
import MyPageProfile from './ui/MyPageProfile';

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
