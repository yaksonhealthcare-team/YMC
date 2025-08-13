import { publicApi } from '@/_shared/services/instance';
import { HTTPResponse } from '@/types/HTTPResponse';
import { TermsResponse } from '@/types/Terms';

export const fetchTerms = async (termsCategoryIdx: number = 0, isUse: string = 'Y') => {
  const { data } = await publicApi.get<HTTPResponse<TermsResponse>>(
    `/auth/signup/terms?terms_category_idx=${termsCategoryIdx}&is_use=${isUse}`
  );
  return data.body;
};
