import { Image } from '@/components/common/Image';
import { Event } from '@/types/Content';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();

  const thumbnail = event.files.find((file) => file.fileurl.length > 0);

  return (
    <div className="bg-white py-4 flex items-start gap-4">
      {thumbnail && (
        <Image
          src={thumbnail.fileurl}
          alt={event.title}
          className="w-[88px] h-[88px] rounded-lg border border-gray-100 object-cover"
        />
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="font-bold text-gray-900 text-16px">{event.title}</div>
          </div>
          <div className="flex items-center mt-2 gap-2">
            {event.status === 'END' && (
              <div className="px-2 py-1 bg-gray-100 rounded-md text-gray-500 text-12px font-medium">종료</div>
            )}
            <div className="text-gray-500 text-12px">
              {event.sdate} ~ {event.edate}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate(`/event/${event.code}`)}
        className=" rounded"
        aria-label={`${event.title} 이벤트`}
      >
        {/* Placeholder for the button */}
      </button>
    </div>
  );
};

export default EventItem;
