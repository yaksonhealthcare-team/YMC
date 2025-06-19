import { DeviceType } from '@apis/auth.api';

export interface SocialLoginRequest {
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
