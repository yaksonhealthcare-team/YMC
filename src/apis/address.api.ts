import { axiosClient } from '@/queries/clients';
import { Location } from '@/types/Location';

export interface AddressSearchResult {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface AddressBookmark {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  isBaseAddress: boolean;
}

export interface ApiResponse<T> {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  body: T;
}

interface AddressBookmarkResponse {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  body: Array<{
    csab_idx: string;
    address: string;
    lat: string;
    lon: string;
    base_address: 'Y' | 'N';
    b_name?: string;
  }>;
}

interface AddressSearchResponse {
  resultCode: string;
  resultMessage: string;
  resultCount: number;
  body: {
    result: {
      b_addr: string;
      b_lat: string;
      b_lon: string;
      b_name?: string;
    }[];
  };
}

export const searchAddress = async (keyword: string): Promise<Location[]> => {
  const { data } = await axiosClient.get<AddressSearchResponse>('/address/search', {
    params: {
      keyword
    }
  });

  return data.body.result.map((item) => ({
    address: item.b_addr || '',
    lat: item.b_lat || '0',
    lon: item.b_lon || '0',
    name: item.b_name || ''
  }));
};

export const getAddressBookmarks = async (): Promise<Location[]> => {
  const { data } = await axiosClient.get<AddressBookmarkResponse>('/address/bookmarks');
  return data.body.map((item) => ({
    csab_idx: item.csab_idx,
    b_idx: item.csab_idx,
    address: item.address,
    lat: item.lat,
    lon: item.lon,
    base_address: item.base_address,
    name: item.b_name || ''
  }));
};

export const addAddressBookmark = async (bookmark: Omit<Location, 'csab_idx'>): Promise<ApiResponse<null>> => {
  const { data } = await axiosClient.post<ApiResponse<null>>('/address/bookmarks', bookmark);
  return data;
};

export const deleteAddressBookmark = async (b_idx: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(`/address/bookmarks`, {
    data: {
      b_idx
    }
  });
  return data;
};
