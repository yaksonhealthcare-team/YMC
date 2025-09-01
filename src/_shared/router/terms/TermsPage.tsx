import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type TermItem = {
  label: string;
  id: number;
};

const TERMS: TermItem[] = [
  { label: '서비스 이용약관', id: 1 },
  { label: '개인정보 수집 이용', id: 2 },
  { label: '위치기반 서비스 이용약관', id: 3 },
  { label: '마케팅 정보 수신 정책', id: 4 }
];

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className={'flex flex-col px-5 divide-y divide-gray-100'}>
        {TERMS.map(({ label, id }) => {
          const path = `/terms/${id}`;
          return (
            <div key={id} className="flex justify-between py-6 cursor-pointer" onClick={() => navigate(path)}>
              <p>{label}</p>
              <CaretRightIcon className="w-4 h-4" />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TermsPage;

const Header = () => {
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '이용약관',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  return null;
};
