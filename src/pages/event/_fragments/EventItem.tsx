import React from "react"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  isEnded: boolean
  imageUrl: string
}

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className="bg-white px-5 py-4 flex items-center gap-4">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-[88px] h-[88px] rounded-lg border border-gray-100"
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="font-bold text-gray-900 text-16px">
              {event.title}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            {event.isEnded && (
              <div className="px-2 py-1 bg-gray-100 rounded-md text-gray-500 text-12px font-medium">
                종료
              </div>
            )}
            <div className="text-gray-500 text-12px">
              {event.startDate} ~ {event.endDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventItem
