import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import { Image } from '@/components/common/Image';
import { EmptyCard } from '@/components/EmptyCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useLayout } from '@/stores/LayoutContext';
import { useEventDetail } from '@/queries/useEventQueries';
import { EventDetail } from '@/types/Event';
import { sanitizeHtml } from '@/utils/sanitize';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEventDetail(id!);
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  if (isError || !event) {
    return <EmptyCard title={`이벤트 정보를 불러올 수 없어요.\n잠시 후 다시 시도해주세요.`} />;
  }

  return (
    <div className="min-h-screen bg-white p-5">
      <div className="flex flex-col gap-6">
        <EventHeader event={event} />
        <div className="w-full h-[1px] bg-[#ECECEC] rounded-[1px]"></div>
        <EventContent event={event} />
      </div>
    </div>
  );
};

const EventHeader = ({ event }: { event: EventDetail }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-18px font-bold text-gray-900">{event.title}</div>
      <div className="flex items-center gap-2">
        <CalendarIcon className={'w-[14px] h-[14px]'} />
        <div className="text-14px font-medium text-gray-500">
          {event.sdate} ~ {event.edate}
        </div>
      </div>
    </div>
  );
};

const EventContent = ({ event }: { event: EventDetail }) => {
  if (!event.contents && (!event.files || event.files.length === 0)) {
    return null;
  }

  return (
    <div className="self-stretch flex flex-col gap-3">
      {event.files?.length > 0 && (
        <div className="flex flex-col gap-4">
          {event.files.map((file, index) => (
            <div key={file.fileCode} className="relative w-full">
              <Image src={file.fileurl} alt={`${event.title} 이미지 ${index + 1}`} className="w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}
      {event.contents && (
        <div
          className="text-16px font-normal text-gray-900 leading-[26.88px] mb-8"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.contents) }}
        />
      )}
    </div>
  );
};

export default EventDetailPage;
