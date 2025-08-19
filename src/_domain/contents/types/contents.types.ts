export interface PopupParams {
  status: string;
}
export interface PopupSchema {
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
}
