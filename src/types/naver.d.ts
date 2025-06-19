interface NaverLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}

interface NaverError {
  error: string;
  error_description: string;
}

interface NaverLoginWithNaverId {
  new (params: {
    clientId: string;
    callbackUrl: string;
    isPopup: boolean;
    loginButton: {
      color: string;
      type: number;
      height: number;
    };
  }): NaverLoginInstance;
}

interface NaverLoginInstance {
  init: () => void;
  getLoginStatus: (callback: (status: boolean) => void) => void;
  logout: () => void;
}

interface Window {
  naver: {
    LoginWithNaverId: NaverLoginWithNaverId;
  };
}
