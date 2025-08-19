export interface CryptoTokenReissueSchema {
  accessToken: string;
}
export interface SigninSocialBody {
  SocialAccessToken: string;
  thirdPartyType: 'K' | 'N' | 'G' | 'A';
  socialId: string;
  deviceToken?: string | null;
  deviceType?: 'android' | 'ios' | 'web';
  id_token?: string;
  SocialRefreshToken?: string | null;
}
export interface SigninSocialSchema extends SigninEmailSchema {
  SocialAccessToken: string;
}
export interface SigninEmailBody {
  username: string;
  password: string;
  deviceToken?: string | null;
  deviceType?: 'android' | 'ios' | 'web';
}
export interface SigninEmailSchema {
  accessToken: string;
  deviceToken: string;
  deviceType: string;
}
