import { publicApi } from '@/_shared/services/instance';
import { HTTPResponse } from '@/types/HTTPResponse';

export interface EncryptData {
  m: string;
  token_version_id: string;
  enc_data: string;
  integrity_value: string;
}

const getReturnUrl = () => {
  // localhost인 경우 현재 origin 사용
  if (window.location.hostname === 'localhost') {
    return `${window.location.origin}/signup/callback`;
  }

  // 그 외의 경우 현재 hostname 사용
  return `${window.location.protocol}//${window.location.hostname}/signup/callback`;
};

export const fetchEncryptDataForNice = async (returnUrl?: string) => {
  const return_url = returnUrl ?? getReturnUrl();

  const { data } = await publicApi.post<HTTPResponse<EncryptData[]>>('/auth/crypto/token.php', { return_url });

  return data.body[0];
};
