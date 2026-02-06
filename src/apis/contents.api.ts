import { authApi } from '@/_shared';
import { ContentMapper } from '@/mappers/ContentMapper';
import { Notice, NoticeDetail, PopupDetail } from '@/types/Content';
import { Event, EventDetail, Tab } from '@/types/Event';
import { HTTPResponse } from '@/types/HTTPResponse';

export const fetchEvents = async (status: Tab = 'ALL'): Promise<Event[]> => {
  const { data } = await authApi.get<HTTPResponse<Event[]>>('/contents/contents', {
    params: {
      gubun: 'E01',
      page: 1,
      status
    }
  });
  return ContentMapper.toEvents(data.body || []);
};

export const fetchEventDetail = async (code: string): Promise<EventDetail> => {
  const { data } = await authApi.get<HTTPResponse<EventDetail[]>>('/contents/detail', {
    params: {
      gubun: 'E01',
      code
    }
  });
  return ContentMapper.toEventDetail(data.body[0]);
};

export const fetchNotices = async (
  page: number = 1
): Promise<{
  notices: Notice[];
  pageInfo: { totalPages: number; currentPage: number };
}> => {
  const { data } = await authApi.get<HTTPResponse<Notice[]>>('/contents/contents', {
    params: {
      gubun: 'N01',
      page
    }
  });
  return {
    notices: ContentMapper.toNotices(data.body),
    pageInfo: {
      totalPages: Number(data.total_page_count),
      currentPage: Number(data.current_page)
    }
  };
};

export const fetchNotice = async (code: string): Promise<NoticeDetail> => {
  const { data } = await authApi.get<HTTPResponse<NoticeDetail[]>>('/contents/detail', {
    params: {
      gubun: 'N01',
      code
    }
  });
  if (!data.body || !data.body.length) {
    throw new Error('Notice not found');
  }
  return ContentMapper.toNoticeDetail(data.body[0]);
};

export interface ApiPopupItem {
  code: string;
  gubun: string;
  title: string;
  sdate: string;
  edate: string;
  status: string;
  files?: {
    fileCode: string;
    fileurl: string;
  }[];
  link: string;
}

export const fetchPopups = async (): Promise<ApiPopupItem[]> => {
  const response = await authApi.get<HTTPResponse<ApiPopupItem[]>>('/contents/popup?status=ING');
  const apiPopups = response.data.body || [];

  return apiPopups;
};

export const fetchPopupDetail = async (code: string): Promise<PopupDetail> => {
  const { data } = await authApi.get<HTTPResponse<PopupDetail[]>>('/contents/detail', {
    params: {
      gubun: 'P01',
      code
    }
  });

  if (!data.body || data.body.length === 0) {
    throw new Error('Popup detail not found');
  }

  return data.body[0];
};
