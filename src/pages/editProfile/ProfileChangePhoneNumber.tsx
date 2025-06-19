import { useLayout } from '../../contexts/LayoutContext.tsx';
import { useEffect } from 'react';
import { Button } from '@components/Button.tsx';
import { checkByNice } from 'utils/niceCheck.ts';
import { fetchEncryptDataForNice } from '@apis/pass.api.ts';

const ProfileChangePhoneNumber = () => {
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '휴대폰 번호 인증하기',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, []);

  const getReturnUrl = () => {
    // localhost인 경우 현재 origin 사용
    if (window.location.hostname === 'localhost') {
      return `${window.location.origin}/profile/change-phone/callback`;
    }

    // 그 외의 경우 현재 hostname 사용
    return `${window.location.protocol}//${window.location.hostname}/profile/change-phone/callback`;
  };

  const onClickCheckByNice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const returnUrl = getReturnUrl();
    const data = await fetchEncryptDataForNice(returnUrl);
    await checkByNice(data);
  };

  return (
    <div className={'flex flex-col p-5'}>
      <p className={'text-center font-sb text-20px mt-32'}>
        {'휴대폰 번호를 바꾸기 위해선'}
        <br />
        {'본인인증이 필요해요.'}
      </p>
      <Button className={'w-full mt-10'} onClick={onClickCheckByNice}>
        {'본인인증 하러가기'}
      </Button>
    </div>
  );
};

export default ProfileChangePhoneNumber;
