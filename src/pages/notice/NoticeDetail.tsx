import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Image } from '@/components/common/Image';
import { useLayout } from '@/stores/LayoutContext';
import { useNotice } from '@/queries/useContentQueries';
import { NoticeDetail as Notice } from '@/types/Content';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from;
  const { setHeader, setNavigation } = useLayout();
  const { data: notice, isLoading, isError } = useNotice(id!);

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      backgroundColor: 'bg-white',
      onClickBack: () => (fromPath ? navigate(fromPath, { replace: true }) : navigate(-1))
    });
    setNavigation({ display: true });
  }, [navigate, fromPath]);

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  if (isError || !notice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">공지사항을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 pb-[72px]">
      <div className="flex flex-col gap-6">
        <NoticeHeader notice={notice} />
        <div className="w-full h-[1px] bg-[#ECECEC] rounded-[1px]"></div>
        <NoticeContent notice={notice} />
      </div>
    </div>
  );
};

const NoticeHeader: React.FC<{ notice: Notice }> = ({ notice }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-18px font-bold text-gray-900">{notice.title}</div>
      <div className="flex items-center gap-2">
        <CalendarIcon className={'w-[14px] h-[14px]'} />
        <div className="text-14px font-medium text-gray-500">{notice.regDate}</div>
      </div>
    </div>
  );
};

const NoticeContent: React.FC<{ notice: Notice }> = ({ notice }) => {
  if (!notice.contents) {
    return null;
  }

  return (
    <div className="self-stretch flex flex-col gap-3">
      <div className="text-16px font-normal text-gray-900 leading-[26.88px] whitespace-pre-wrap">{notice.contents}</div>
      {notice.files?.length > 0 &&
        notice.files.map((file, index) => (
          <div className={`mt-4 ${index === notice.files.length - 1 ? 'mb-[24px]' : 'mb-0'}`} key={file.fileCode}>
            <Image src={file.fileurl} alt="공지사항 이미지" className="w-full rounded-lg" />
          </div>
        ))}
    </div>
  );
};

export default NoticeDetailPage;
