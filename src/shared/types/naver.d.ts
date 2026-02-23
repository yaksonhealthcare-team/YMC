interface NaverLoginInstance {
  init: () => void;
  getLoginStatus: (callback: (status: boolean) => void) => void;
  logout: () => void;
}

export interface NaverLoginWithNaverId {
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
