import { useOverlay } from '@/stores/ModalContext';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const BUTTON_STYLES = {
  base: clsx(
    'font-sb text-14px text-gray-400',
    '',
    'hover:text-gray-600 transition-colors duration-200',
    'rounded px-2 py-1'
  )
} as const;

const MyPageFooter = () => {
  const navigate = useNavigate();
  const { openModal } = useOverlay();

  const handleOnClickLogout = () => {
    openModal({
      title: '로그아웃',
      message: '로그아웃 하시겠습니까?',
      onConfirm: () => {
        navigate('/logout', { replace: true });
      },
      onCancel: () => {}
    });
  };

  return (
    <footer className="flex flex-col items-center gap-4 mt-8 mb-20" role="contentinfo">
      <nav className="flex items-center gap-3" aria-label="푸터 메뉴">
        <button onClick={() => navigate('/terms')} className={BUTTON_STYLES.base} aria-label="이용약관 페이지로 이동">
          이용약관
        </button>
        <div className="w-[1px] h-3.5 bg-gray-200" role="separator" aria-hidden="true" />
        <button onClick={handleOnClickLogout} className={BUTTON_STYLES.base} aria-label="로그아웃 확인 모달 열기">
          로그아웃
        </button>
      </nav>
      <div className="font-r text-12px text-gray-300" role="contentinfo" aria-label="앱 버전 정보">
        v.1.1.4 version
      </div>
    </footer>
  );
};

export default MyPageFooter;
