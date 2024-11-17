import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchField } from "@components/SearchField.tsx"
import SavedLocationList from "./SavedLocationList.tsx"
import LocationSearchResultList from "./LocationSearchResultList.tsx"
import LocationSearchPlaceholder from "./LocationSearchPlaceholder.tsx"
import { Location } from "../../../types/Location.ts"

const LocationSettingsHeader = ({
  onClickBack,
}: {
  onClickBack: () => void
}) => (
  <div className={"flex justify-between items-center bg-white px-5 py-4 h-12"}>
    <button onClick={onClickBack}>
      <CloseIcon className={"w-5 h-5"} />
    </button>
    <p className={"font-sb text-16px"}>{"위치 설정"}</p>
    <div className={"w-5"} />
  </div>
)

const LocationSettingsSearchBar = ({
  text,
  setText,
  onClickCurrentLocation,
}: {
  text: string
  setText: (text: string) => void
  onClickCurrentLocation: () => void
}) => {
  return (
    <div className={"flex flex-col gap-6 px-5"}>
      <SearchField
        placeholder="도로명, 건물명, 지번으로 검색하세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClear={text.length > 0 ? () => setText("") : undefined}
      />
      <button
        className={"flex justify-center items-center gap-2"}
        onClick={onClickCurrentLocation}
      >
        <CrosshairIcon className={"text-primary"} />
        <p>{"현재 위치로 주소 설정"}</p>
      </button>
    </div>
  )
}

const LocationSettings = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const [address, setAddress] = useState("")
  const [isEditing] = useState(false)

  const handleCloseButtonClicked = () => {
    if (location.state?.from === "/branch") {
      navigate(-1)
    } else {
      navigate("/branch")
    }
  }

  useEffect(() => {
    setHeader({
      display: true,
      component: (
        <LocationSettingsHeader onClickBack={handleCloseButtonClicked} />
      ),
    })
    setNavigation({ display: false })
  }, [])

  const renderContent = () => {
    if (address.length > 0) {
      return (
        <LocationSearchResultList
          locations={locations.filter((location) =>
            location.title.includes(address),
          )}
          onClick={() => {}}
        />
      )
    }
    return isEditing ? <LocationSearchPlaceholder /> : <SavedLocationList />
  }

  return (
    <div
      className={
        "flex flex-col items-stretch mt-5 w-full h-full overflow-hidden"
      }
    >
      <LocationSettingsSearchBar
        text={address}
        setText={setAddress}
        onClickCurrentLocation={() => {}}
      />
      <div className={"w-full h-2 bg-gray-50 mt-6"} />
      {renderContent()}
    </div>
  )
}

export default LocationSettings

// Test location data
const locations: Location[] = Array.from({ length: 30 }, (_, index) => ({
  title: `약손명가 ${index}점`,
  address: "서울 강남구 테헤란로",
}))
