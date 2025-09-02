export type EventStatus = 'ALL' | 'ING' | 'END' | 'TBD';

export interface Event {
  code: string;
  gubun: string;
  title: string;
  sdate: string;
  edate: string;
  status: EventStatus;
  files: {
    fileCode: string;
    fileurl: string;
  }[];
}

export interface Notice {
  code: string;
  gubun: string;
  title: string;
  regDate: string;
}

export interface NoticeDetail {
  code: string;
  gubun: string;
  title: string;
  regDate: string;
  contents: string;
  files: Array<{
    fileCode: string;
    fileurl: string;
  }>;
}

// Interface for Popup Detail data from API (/contents/detail)
export interface PopupDetail {
  code: string;
  gubun: string; // Should be 'P01' for popups according to the endpoint
  title: string;
  content?: string; // Assuming there might be HTML content for detail
  sdate: string;
  edate: string;
  status: string;
  files?: {
    fileCode: string;
    fileurl: string;
  }[];
  // Add other relevant fields if provided by the detail API
}
