import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"

const MembershipUsage = () => {
  return (
    <div className="flex flex-col gap-[16px] mt-[40px]">
      <div className="flex justify-between">
        <p className="font-b">회원권 사용 현황 길</p>
        <div className="flex items-center cursor-pointer" onClick={() => {}}>
          <span className="font-r text-12px text-gray-500">사용내역보기 </span>
          <CaretRightIcon className="w-3 h-3" />
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div>
          <p className="text-gray-500 font-sb text-[14px]">회원권명</p>
          <p className="font-r text-[14px] text-gray-700 mt-[4px]">
            회원권명이 노출됩니다
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-sb text-[14px]">사용 지점</p>
          <p className="font-r text-[14px] text-gray-700 mt-[4px]">
            약손명가 강남구청역점
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-sb text-[14px]">잔여 횟수</p>
          <p className="font-r text-[14px] text-gray-700 mt-[4px]">
            4회 / 10회
          </p>
        </div>
      </div>
    </div>
  )
}

export default MembershipUsage
