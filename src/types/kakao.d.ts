interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoError {
  error: string;
  error_description: string;
}

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (settings: { redirectUri: string; state?: string; scope?: string }) => void;
    login: (settings: { success: (response: KakaoAuthResponse) => void; fail: (error: KakaoError) => void }) => void;
    getAccessToken: () => string | null;
  };
}

interface Window {
  Kakao: KakaoSDK;
}
