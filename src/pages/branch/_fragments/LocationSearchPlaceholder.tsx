interface LocationSearchPlaceholderProps {
  isSearchFocused?: boolean
}

const LocationSearchPlaceholder = ({
  isSearchFocused = false,
}: LocationSearchPlaceholderProps) => {
  const renderStyledPlaceholder = (label: string, content: string) => {
    return (
      <div className={"flex flex-col gap-1"}>
        <p className={"text-gray-400 font-r text-14px"}>{label}</p>
        <p className={"text-gray-300 font-r text-12px"}>{content}</p>
      </div>
    )
  }

  if (isSearchFocused) {
    return (
      <div className={"flex flex-col gap-3 px-5 py-6"}>
        <p className={"font-sb text-14px"}>{"이렇게 검색해보세요."}</p>
        <div className={"flex flex-col gap-2"}>
          {renderStyledPlaceholder("도로명 + 건물번호", "테헤란로78길 14-10")}
          {renderStyledPlaceholder("지역명(동/리) + 번지", "대치동 891-39")}
          {renderStyledPlaceholder(
            "지역명(동/리) + 건물명",
            "대치동 테헤란빌딩",
          )}
        </div>
      </div>
    )
  }

  // 포커스가 없을 때의 기본 안내 메시지
  return (
    <div className={"flex flex-col items-center justify-center px-5 py-6"}>
      <p className={"text-gray-400 font-r text-14px"}>
        {"등록된 주소가 없습니다."}
      </p>
    </div>
  )
}

export default LocationSearchPlaceholder
