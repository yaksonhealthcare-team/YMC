import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import MapView from "@components/MapView.tsx"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"
import LocationSelectorPin from "@assets/icons/pin/LocationSelectorPin.svg?react"
import { Coordinate } from "../../../types/Coordinate.ts"
import { Button } from "@components/Button.tsx"

const LocationPickerMap = () => {
  const { naver } = window
  const { setHeader, setNavigation } = useLayout()
  const { location, loading } = useGeolocation()
  const [center, setCenter] = useState<Coordinate | null>(null)
  const [address, setAddress] = useState({
    jibun: "",
    road: "",
  })

  useEffect(() => {
    setHeader({
      left: "back",
      title: "위치 확인",
      backgroundColor: "bg-white drop-shadow-md",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    if (location) {
      setCenter(location)
    }
  }, [location])

  useEffect(() => {
    if (!center) return
    setAddressFromCoords(center)
  }, [center])

  const setAddressFromCoords = (coords: Coordinate) => {
    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(coords.latitude, coords.longitude),
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      (_, response) => {
        setAddress({
          jibun: response.v2.address.jibunAddress,
          road: response.v2.address.roadAddress,
        })
      },
    )
  }

  if (loading || !center) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-gray-500">현재 위치를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className={"relative w-full h-full"}>
      <MapView
        center={center}
        branches={[]}
        options={{
          showCurrentLocation: false,
          showCurrentLocationButton: true,
          currentLocationButtonClassName: "!bottom-52",
          onMoveMap: setCenter,
        }}
      />
      <div
        className={
          "absolute top-2 left-5 right-5 bg-gray-700/70 py-2 rounded-md"
        }
      >
        <p className={"text-center text-white font-m text-14px"}>
          {"지도를 움직여 위치를 설정하세요."}
        </p>
      </div>
      <LocationSelectorPin
        className={
          "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[100%] pointer-events-none"
        }
      />
      <div
        className={
          "absolute bottom-0 rounded-t-2xl bg-white w-full z-[300] pt-6 pb-8"
        }
      >
        {address.road.length > 0 && (
          <p className={"px-5 font-b"}>{address.road}</p>
        )}
        {address.jibun.length > 0 && (
          <p className={"px-5 text-14px text-gray-500 mt-2"}>{address.jibun}</p>
        )}
        <div className={"w-full h-[1px] bg-gray-50 mt-6"} />
        <div className={"w-full px-5 mt-3"}>
          <Button variantType={"primary"} className={"w-full"}>
            {"이 위치로 설정"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LocationPickerMap
