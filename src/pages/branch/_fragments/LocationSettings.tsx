import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchField } from "@components/SearchField.tsx"
import SavedLocationList from "./SavedLocationList.tsx"
import LocationSearchResultList from "./LocationSearchResultList.tsx"
import {
  useAddAddressBookmarkMutation,
  useAddressBookmarks,
  useAddressSearch,
} from "../../../queries/useAddressQueries.ts"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"
import { useOverlay } from "../../../contexts/ModalContext"

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
  onFocus,
  onBlur,
}: {
  text: string
  setText: (text: string) => void
  onClickCurrentLocation: () => void
  onFocus: () => void
  onBlur: () => void
}) => {
  return (
    <div className={"flex flex-col gap-6 px-5"}>
      <SearchField
        placeholder="도로명, 건물명, 지번으로 검색하세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClear={text.length > 0 ? () => setText("") : undefined}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <button
        className={"flex justify-center items-center gap-2"}
        onClick={onClickCurrentLocation}
      >
        <CrosshairIcon className={"text-primary"} />
        <p className={"font-sb text-14px"}>{"현재 위치로 주소 설정"}</p>
      </button>
    </div>
  )
}

const LocationSettings = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const [address, setAddress] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { setLocation } = useBranchLocationSelect()
  const { mutate: addBookmark } = useAddAddressBookmarkMutation()
  const {
    location: currentLocation,
    error: locationError,
    loading: locationLoading,
  } = useGeolocation()
  const { showToast } = useOverlay()

  const { data: searchResults = [] } = useAddressSearch(address)
  useAddressBookmarks()

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

  useEffect(() => {
    if (locationError) {
      showToast(locationError)
    }
  }, [locationError, showToast])

  const handleCurrentLocationClick = () => {
    if (locationLoading) {
      showToast("위치 정보를 가져오는 중입니다.")
      return
    }

    if (currentLocation) {
      const coords = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }
      setLocation({
        address: "현재 위치",
        coords,
      })
      addBookmark({
        address: "현재 위치",
        lat: currentLocation.latitude.toString(),
        lon: currentLocation.longitude.toString(),
      })
      navigate("/branch", {
        state: {
          selectedLocation: {
            address: "현재 위치",
            coords,
          },
        },
      })
    }
  }

  const renderContent = () => {
    if (address.length > 0) {
      return (
        <LocationSearchResultList
          type="search"
          locations={searchResults}
          onClick={(location) => {
            const coords = {
              latitude: parseFloat(location.lat),
              longitude: parseFloat(location.lon),
            }
            setLocation({
              address: location.address,
              coords,
            })
            addBookmark({
              address: location.address,
              lat: location.lat,
              lon: location.lon,
            })
            navigate("/branch", {
              state: {
                selectedLocation: {
                  address: location.address,
                  coords,
                },
              },
            })
          }}
          isSearchFocused={isSearchFocused}
        />
      )
    }
    return <SavedLocationList isSearchFocused={isSearchFocused} />
  }

  return (
    <div className={"flex flex-col h-full"}>
      <LocationSettingsSearchBar
        text={address}
        setText={setAddress}
        onClickCurrentLocation={handleCurrentLocationClick}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
      {renderContent()}
    </div>
  )
}

export default LocationSettings
