import { getUser, saveAccessToken, useSigninSocialMutation, useUserStore } from '@/_domain/auth';
import { logger } from '@/_shared';
import { publicApi } from '@/_shared/services/instance';
import { normalizeAppInfo, useAppInfoStore } from '@/stores/appInfoStore';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type DeviceType = 'android' | 'ios' | 'web';
interface SocialLoginBody {
  provider: 'A' | 'K' | 'N' | 'G';
  authorizationCode?: string;
  idToken?: string;
  accessToken: string;
  socialId: string;
  refreshToken?: string;
  fcmToken?: string;
  deviceType?: DeviceType;
  email?: string;
}

/**
 * 웹뷰 <-> 앱 메세지 통신 훅
 */
export const useNewAppBridge = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setAppInfo } = useAppInfoStore();
  const { mutateAsync: signinMutateAsync } = useSigninSocialMutation();

  const handleSocialLogin = useCallback(
    async (data: SocialLoginBody) => {
      const { provider } = data;

      try {
        if (provider === 'A') {
          // 애플 로그인
          const callbackUrl = 'auth/apple_callback';
          const response = await publicApi.post(callbackUrl, {
            code: data.authorizationCode,
            id_token: data.idToken,
            state: 'state',
            client_type: 'bundle'
          });

          const msg = JSON.stringify(response.data);
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'NETWORK', msg }));
          return;
        }

        const { accessToken, socialId, fcmToken, deviceType, idToken, refreshToken } = data;
        const body = {
          SocialAccessToken: accessToken,
          SocialRefreshToken: refreshToken,
          socialId,
          thirdPartyType: provider,
          deviceToken: fcmToken,
          deviceType,
          id_token: idToken
        };
        const response = await signinMutateAsync(body);

        const resAccessToken = response.data.body[0].accessToken;
        if (!resAccessToken) throw new Error();
        saveAccessToken(resAccessToken);

        const user = await getUser();
        const userData = user.data.body[0];
        setUser(userData);
        navigate('/', { replace: true });
      } catch (error: any) {
        const msg = JSON.stringify(error);
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'NETWORK', msg }));

        if (error.response?.status === 401) {
          // 첫 로그인하는 회원일 경우
          const { accessToken, socialId, fcmToken, deviceType, idToken, refreshToken, email } = data;

          const socialSignupInfo = {
            next_action_type: 'signup',
            thirdPartyType: provider,
            socialId,
            SocialAccessToken: accessToken,
            SocialRefreshToken: refreshToken,
            deviceToken: fcmToken,
            deviceType,
            id_token: idToken,
            email
          };

          sessionStorage.setItem('socialSignupInfo', JSON.stringify(socialSignupInfo));
          navigate('/signup/terms');
          return;
        }

        logger.error(error);
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'LOGIN_FAIL' }));
      }
    },
    [navigate, setUser, signinMutateAsync]
  );

  useEffect(() => {
    if (!window.ReactNativeWebView) return;

    const handleWebviewMessage = async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'SOCIAL_LOGIN':
            await handleSocialLogin(data.data);
            break;
          case 'FCM_TOKEN':
            localStorage.setItem('FCM_TOKEN', data.fcmToken);
            break;
          case 'DEVICE_TYPE':
            localStorage.setItem('DEVICE_TYPE', data.deviceType);
            break;
          case 'PUSH_NAVIGATE': {
            const url = data?.url ?? data?.data?.url;
            if (url) navigate(url);
            break;
          }
          case 'APP_INFO': {
            const appInfo = normalizeAppInfo(data);
            if (appInfo) setAppInfo(appInfo);
            break;
          }
          default:
            break;
        }
      } catch (error) {
        logger.error(error);
      }
    };

    window.addEventListener('message', handleWebviewMessage, true);
    document.addEventListener('message', handleWebviewMessage as any, true);

    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'WEB_LOADED' }));

    return () => {
      window.removeEventListener('message', handleWebviewMessage, true);
      document.removeEventListener('message', handleWebviewMessage as any, true);
    };
  }, [handleSocialLogin, navigate, setAppInfo]);
};
