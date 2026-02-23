import { getUser, saveAccessToken, useSigninSocialMutation, useUserStore } from '@/_domain/auth';
import { requestForToken } from '@/_shared';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { safeDecodeAndParseJson } from '@/shared/lib/utils/sentry.utils';

const OAuthCallback = () => {
  const { provider } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useUserStore();
  const { openModal } = useOverlay();
  const { setHeader, setNavigation } = useLayout();
  const isProcessing = useRef(false);
  const { mutateAsync: signinMutateAsync } = useSigninSocialMutation();

  useEffect(() => {
    setHeader({ display: false });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const jsonData = searchParams.get('jsonData');
        if (!jsonData) return;

        const parsedData = safeDecodeAndParseJson<{ body?: any[] }>(jsonData, {
          source: 'oauth_callback_jsonData',
          tags: { feature: 'oauth_callback' },
          context: { provider }
        });
        if (!parsedData?.body?.[0]) throw new Error('유효하지 않은 소셜 로그인 응답입니다.');
        const socialData = parsedData.body[0];

        // next_action_type에 따라 분기 처리
        if (socialData.next_action_type === 'signup') {
          const socialSignupInfo = {
            provider: getProviderCode(provider),
            ...socialData
          };

          sessionStorage.setItem('socialSignupInfo', JSON.stringify(socialSignupInfo));
          navigate('/signup/terms', { replace: true });
          return;
        }

        // 이미 가입된 회원 (next_action_type === "signin")
        try {
          const body = {
            SocialAccessToken: socialData.SocialAccessToken,
            thirdPartyType: getProviderCode(provider),
            socialId: socialData.socialId,
            deviceToken: await requestForToken(),
            deviceType: window.osType ?? 'web',
            id_token: socialData.id_token,
            SocialRefreshToken: socialData.SocialRefreshToken
          };
          const signinResponse = await signinMutateAsync(body);
          const accessToken = signinResponse.data.body[0].accessToken;
          saveAccessToken(accessToken);

          const data = await getUser();
          const user = data.data.body[0];
          setUser(user);

          navigate('/', { replace: true });
          return;
        } catch (error: any) {
          if (error.response?.status === 401) {
            const socialSignupInfo = {
              provider: getProviderCode(provider),
              ...socialData
            };

            sessionStorage.setItem('socialSignupInfo', JSON.stringify(socialSignupInfo));
            navigate('/signup/terms', { replace: true });
            return;
          }
          throw error;
        }
      } catch {
        openModal({
          title: '오류',
          message: '로그인에 실패했습니다.',
          onConfirm: () => {
            navigate('/login', { replace: true });
          }
        });
      }
    };

    handleCallback();
  }, [provider, navigate, openModal, searchParams, setUser, signinMutateAsync]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingIndicator />
    </div>
  );
};

// provider 코드 변환
const getProviderCode = (provider?: string): 'K' | 'N' | 'G' | 'A' => {
  switch (provider) {
    case 'kakao':
      return 'K';
    case 'naver':
      return 'N';
    case 'google':
      return 'G';
    case 'apple':
      return 'A';
    default:
      throw new Error('Invalid provider');
  }
};

export default OAuthCallback;
