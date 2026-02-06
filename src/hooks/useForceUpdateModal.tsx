import { useAppInfoStore } from '@/stores/appInfoStore';
import { useOverlay } from '@/stores/ModalContext';
import { useNavigate } from 'react-router-dom';

const IOS_WEB = 'https://apps.apple.com/app/id6739484377';
const IOS_SCHEME = 'itms-apps://itunes.apple.com/app/id6739484377';

const ANDROID_WEB = 'https://play.google.com/store/apps/details?id=com.yaksonhc.therapist';
const ANDROID_SCHEME = 'market://details?id=com.yaksonhc.therapist';

export const openStoreFromWebView = (platform?: 'ios' | 'android') => {
  let schemeUrl = '';
  let webUrl = '';

  if (platform === 'ios') {
    schemeUrl = IOS_SCHEME;
    webUrl = IOS_WEB;
  } else if (platform === 'android') {
    schemeUrl = ANDROID_SCHEME;
    webUrl = ANDROID_WEB;
  }

  let fallbackTimer: number | undefined;

  const cancelFallback = () => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = undefined;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      cancelFallback();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);

  window.location.href = schemeUrl;

  fallbackTimer = window.setTimeout(() => {
    cancelFallback();
    window.location.href = webUrl;
  }, 1000);
};

export const useForceUpdateModal = () => {
  const { openModal, closeOverlay } = useOverlay();
  const { appInfo } = useAppInfoStore();
  const navigate = useNavigate();

  const redirectHome = () => {
    closeOverlay();
    navigate('/', { replace: true });
  };

  const openForceUpdateModal = () => {
    openModal({
      title: '앱 업데이트 필요',
      message: '최신 버전으로 업데이트 후 이용해주세요.',
      style: 'confirm',

      onCancel: (_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        redirectHome();
      },
      onConfirm: () => {
        redirectHome();

        const platform = appInfo?.platform as 'ios' | 'android' | undefined;
        if (platform) openStoreFromWebView(platform);
      }
    });
  };

  return { openForceUpdateModal };
};
