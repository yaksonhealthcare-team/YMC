import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Coordinate } from "../types/Coordinate.ts"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { useNaverMapBranchMarkers } from "../hooks/useNaverMapBranchMarkers.tsx"
import { getCurrentLocation } from "../utils/getCurrentLocation.ts"
import { useNaverMap } from "../hooks/useNaverMap.ts"
import { useDebounce } from "../hooks/useDebounce.ts"

interface MapViewProps {
  center: Coordinate
  branches?: Branch[]
  options?: {
    showCurrentLocationButton?: boolean
    showCurrentLocation?: boolean
    onMoveMap?: (coordinate: Coordinate) => void
    onSelectBranch?: (branch: Branch) => void
    currentLocationButtonPosition?: string
  }
}

const MapView = ({
  center,
  branches = [],
  options = { showCurrentLocationButton: true },
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const [selectedBranch] = useState<Branch | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  )
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const { isLoaded, error } = useNaverMap()

  // onMoveMap 최신 상태를 유지하기 위한 ref
  const onMoveMapRef = useRef(options?.onMoveMap)
  useEffect(() => {
    onMoveMapRef.current = options?.onMoveMap
  }, [options?.onMoveMap])

  const handleMapMove = useCallback(() => {
    if (mapInstance.current && onMoveMapRef.current) {
      const currentCenter = mapInstance.current.getCenter()
      onMoveMapRef.current({
        latitude: currentCenter.y,
        longitude: currentCenter.x,
      })
    }
  }, []) // ref는 의존성 배열에 포함하지 않음

  // 컴포넌트 최상위 레벨에서 useDebounce 호출
  const debouncedMapMoveHandler = useDebounce(handleMapMove, 500)

  const handleClickMarker = useCallback(
    (branch: Branch) => {
      if (!mapInstance.current) return

      // 지점 선택 이벤트를 먼저 발생시킴
      if (options?.onSelectBranch) {
        options.onSelectBranch(branch)
      }

      // 지도 이동은 이벤트 발생 후에 처리
      const newCenter = new window.naver.maps.LatLng(
        branch.latitude,
        branch.longitude,
      )
      mapInstance.current.setCenter(newCenter)
    },
    [options?.onSelectBranch],
  )

  const markerOptions = useMemo(
    () => ({
      showCurrentLocationMarker: options?.showCurrentLocation,
      onClickMarker: handleClickMarker,
    }),
    [options?.showCurrentLocation, handleClickMarker],
  )

  const { updateCurrentLocationMarker } = useNaverMapBranchMarkers({
    map: mapInstance.current,
    branches,
    selectedBranchId: selectedBranch?.b_idx
      ? Number(selectedBranch.b_idx)
      : null,
    options: markerOptions,
  })

  // 지도 초기화 및 이벤트 리스너 설정 useEffect
  useEffect(() => {
    let mounted = true
    let dragEndListener: naver.maps.MapEventListener | null = null

    const initializeMap = () => {
      if (!mapRef.current || !center || mapInstance.current) {
        return
      }

      try {
        mapInstance.current = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(
            center.latitude,
            center.longitude,
          ),
          zoom: 14,
        })

        if (!mounted) return
        setIsMapInitialized(true)

        // dragend 이벤트 리스너 설정 (디바운스 핸들러 사용)
        if (options?.onMoveMap && mapInstance.current) {
          dragEndListener = window.naver.maps.Event.addListener(
            mapInstance.current,
            "dragend",
            debouncedMapMoveHandler,
          )
        }

        if (options?.showCurrentLocation) {
          getCurrentLocation({
            onSuccess: (coords) => {
              if (mounted) {
                setCurrentLocation(coords)
              }
            },
          })
        }
      } catch (e) {
        console.error("Failed to initialize map:", e)
      }
    }

    if (isLoaded && !mapInstance.current) {
      if (!mapRef.current) {
        const checkMapRef = setInterval(() => {
          if (mapRef.current) {
            clearInterval(checkMapRef)
            if (mounted) initializeMap()
          }
        }, 100)

        return () => {
          mounted = false
          clearInterval(checkMapRef)
          // 컴포넌트 언마운트 시 리스너 제거
          if (dragEndListener) {
            window.naver.maps.Event.removeListener(dragEndListener)
          }
        }
      } else {
        initializeMap()
      }
    }

    // 컴포넌트 언마운트 또는 의존성 변경 시 리스너 제거
    return () => {
      mounted = false
      if (dragEndListener) {
        window.naver.maps.Event.removeListener(dragEndListener)
      }
    }
  }, [
    isLoaded,
    center?.latitude, // center 변경 시 재초기화 방지를 위해 의존성에서 제거 고려
    center?.longitude, // center 변경 시 재초기화 방지를 위해 의존성에서 제거 고려
    debouncedMapMoveHandler, // 디바운스 핸들러를 의존성에 추가
    options?.showCurrentLocation,
    // options?.onMoveMap 은 ref로 관리하므로 의존성에서 제거
  ])

  // 지도 센터 이동 useEffect (지도 초기화와 분리)
  useEffect(() => {
    if (isMapInitialized && mapInstance.current && center) {
      const currentMapCenter = mapInstance.current.getCenter()
      const newCenterLatLng = new window.naver.maps.LatLng(
        center.latitude,
        center.longitude,
      )

      if (!currentMapCenter.equals(newCenterLatLng)) {
        mapInstance.current.setCenter(newCenterLatLng)
      }
    }
  }, [center, isMapInitialized])

  useEffect(() => {
    if (isMapInitialized && currentLocation && mapInstance.current) {
      updateCurrentLocationMarker(currentLocation)
    }
  }, [currentLocation, isMapInitialized, updateCurrentLocationMarker])

  const handleCurrentLocationClick = () => {
    getCurrentLocation({
      onSuccess: (coords) => {
        setCurrentLocation(coords)
        if (mapInstance.current) {
          mapInstance.current.setCenter(
            new window.naver.maps.LatLng(coords.latitude, coords.longitude),
          )
        }
      },
    })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-red-500">지도 로딩 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  if (!isLoaded || !center) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-gray-500">지도를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map" className="w-full h-full" />
      {options?.showCurrentLocationButton && (
        <button
          onClick={handleCurrentLocationClick}
          className={`absolute bottom-10 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 ${options.currentLocationButtonPosition || ""}`}
        >
          <CrosshairIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default MapView
