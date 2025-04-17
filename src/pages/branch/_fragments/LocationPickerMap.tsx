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
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const { setHeader, setNavigation } = useLayout()
  const { location, loading } = useGeolocation()
  const { setLocation } = useBranchLocationSelect()
  const { address, fetchAddressFromCoords } = useAddressFromCoords()
  const [center, setCenter] = useState<Coordinate | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  // 초기 화면 설정
  useEffect(() => {
    setHeader({
      left: "back",
      title: "위치 확인",
      backgroundColor: "bg-[#ffffff]",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  // 위치 초기화
  useEffect(() => {
    let initialCoords: Coordinate | null = null

    // 1. 이전 페이지(LocationSettings)에서 state로 좌표를 전달받은 경우
    if (routeLocation.state?.selectedLocation?.coords) {
      initialCoords = routeLocation.state.selectedLocation.coords
    }
    // 2. state가 없고, 현재 위치(geolocation)를 성공적으로 가져온 경우
    else if (location) {
      initialCoords = location
    }

    // 유효한 초기 좌표가 결정된 경우
    if (initialCoords) {
      setCenter(initialCoords) // 지도 중심 설정
      fetchAddressFromCoords(initialCoords) // 좌표로 실제 주소 가져오기 (항상 호출)
      fetchBranchesNearby(initialCoords) // 좌표로 주변 지점 가져오기 (항상 호출)
    }
  }, [routeLocation.state, location]) // 의존성 배열은 그대로 두거나, 필요시 lint 경고에 따라 fetch 함수 추가

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
    setCenter(newCenter)
    fetchAddressFromCoords(newCenter)
  }

  // 지점 선택 처리
  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    const newCenter = {
      latitude: branch.latitude,
      longitude: branch.longitude,
    }
    setCenter(newCenter)
    fetchAddressFromCoords(newCenter)
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
            jibun: address.jibun,
          },
          coords: center,
          name:
            selectedBranch?.name ||
            routeLocation.state?.selectedLocation?.name ||
            "",
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
          onSelectBranch: handleSelectBranch,
        }}
      />
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
