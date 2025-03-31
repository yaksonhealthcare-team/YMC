import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import MapView from "@components/MapView.tsx"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"
import LocationSelectorPin from "@assets/icons/pin/LocationSelectorPin.svg?react"
import { Coordinate } from "../../../types/Coordinate.ts"
import { Button } from "@components/Button.tsx"
import { fetchBranches } from "../../../apis/branch.api.ts"
import { Branch } from "../../../types/Branch.ts"
import { useLocation, useNavigate } from "react-router-dom"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect.ts"
import { useAddressFromCoords } from "../../../hooks/useAddressFromCoords.ts"

const LocationPickerMap = () => {
  const { naver } = window
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const { setHeader, setNavigation } = useLayout()
  const { location, loading } = useGeolocation()
  const { setLocation } = useBranchLocationSelect()
  const { address, fetchAddressFromCoords, updateAddressInfo } = useAddressFromCoords()
  const [center, setCenter] = useState<Coordinate | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [hasDragged, setHasDragged] = useState(false)

  // 초기 화면 설정
  useEffect(() => {
    setHeader({
      left: "back",
      title: "위치 확인",
      backgroundColor: "bg-white drop-shadow-md",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  // 위치 초기화
  useEffect(() => {
    if (routeLocation.state?.selectedLocation?.coords) {
      const { coords, address: locationAddress } = routeLocation.state.selectedLocation
      setCenter(coords)
      updateAddressInfo(locationAddress)
      setHasDragged(true)
    } else if (location) {
      setCenter(location)
    }
  }, [routeLocation.state, location])

  // 중심 좌표 변경 시 관련 데이터 업데이트
  useEffect(() => {
    if (!center) return
    
    fetchAddressFromCoords(center)
    fetchBranchesNearby(center)
  }, [center])

  // 주변 지점 가져오기
  const fetchBranchesNearby = async (coords: Coordinate) => {
    try {
      const result = await fetchBranches({
        page: 1,
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
      setBranches(result.branches)
    } catch (error) {
      console.error("Failed to fetch branches:", error)
    }
  }

  // 위치 이동 감지 및 처리
  const handleMapMove = (newCenter: Coordinate) => {
    if (routeLocation.state?.selectedLocation && center) {
      const isSignificantMove = 
        Math.abs(newCenter.latitude - center.latitude) > 0.0001 || 
        Math.abs(newCenter.longitude - center.longitude) > 0.0001
      
      if (isSignificantMove) {
        setHasDragged(true)
      }
    } else {
      setHasDragged(true)
    }
    
    setCenter(newCenter)
  }

  // 위치 설정 및 페이지 이동
  const handleSetLocation = () => {
    if (!center || !address.road) return

    setLocation({
      address: address.road,
      coords: center,
    })
    navigate("/branch/location/confirm", {
      state: {
        selectedLocation: {
          address: {
            road: address.road,
            jibun: address.jibun
          },
          coords: center,
        },
      },
    })
  }

  // 로딩 상태 표시
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
        branches={branches}
        options={{
          showCurrentLocation: false,
          showCurrentLocationButton: true,
          onMoveMap: handleMapMove,
        }}
      />
      {!hasDragged && (
        <div
          className={
            "absolute top-2 left-5 right-5 bg-gray-700/70 py-2 rounded-md"
          }
        >
          <p className={"text-center text-white font-m text-14px"}>
            {"지도를 움직여 위치를 설정하세요."}
          </p>
        </div>
      )}
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
        <div className={"w-full px-5 mt-3 flex gap-2"}>
          <Button
            variantType={"primary"}
            className={"flex-1"}
            onClick={handleSetLocation}
          >
            {"이 위치로 설정"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LocationPickerMap
