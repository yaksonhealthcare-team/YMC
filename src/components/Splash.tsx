import Logo from '@/components/Logo';
import PageContainer from '@/components/PageContainer';
import { useLayout } from '@/contexts/LayoutContext';
import React, { useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const { setNavigation } = useLayout();

  useEffect(() => {
    setNavigation({ display: false });
  }, []);

  return (
    <PageContainer>
      <div className={'flex flex-col h-full w-full justify-center items-center bg-system-bg p-14'}>
        <div className={'p-48'}>
          <Logo text size={191} />
        </div>
      </div>
    </PageContainer>
  );
};

export default SplashScreen;
