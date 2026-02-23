import { ListResponse } from '@/_shared';

export type ContentsGubun = 'E01' | 'N01' | 'P01';
export type ContentsStatus = 'ALL' | 'ING' | 'END' | 'TBD';
export type ContentsFile = {
  fileCode: string;
  fileurl: string;
};
export interface ContentsSchema {
  code: string;
  gubun: ContentsGubun;
  title: string;
  sdate: string;
  edate: string;
  status: ContentsStatus;
  files?: ContentsFile[];
}
export interface ContentsParams {
  gubun: ContentsGubun;
  page?: number;
  status?: ContentsStatus;
}
export interface ContentsResponse extends ListResponse<ContentsSchema> {
  gubun: ContentsGubun;
}
