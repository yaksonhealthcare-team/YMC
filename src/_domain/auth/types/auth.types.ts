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
export interface TermsParams {
  terms_category_idx: number;
  is_use: string;
}
export interface TermsSchema {
  terms: TermsCategory[];
}
export interface TermsCategory {
  terms_category_idx: string;
  terms_category_name: string;
  is_required: string;
  terms_list: TermsItem[];
}
export interface TermsItem {
  terms_idx: string;
  terms_version: string;
  terms_category_idx: string;
  terms_title: string;
  terms_sub_title: string;
  terms_content: string;
  terms_reg_date: string;
  is_use: string;
}
