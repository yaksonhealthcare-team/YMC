import { useEffect, useRef, useState } from "react"
import { Coordinate } from "../types/Coordinate.ts"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { useNaverMapBranchMarkers } from "../hooks/useNaverMapBranchMarkers.tsx"
import { getCurrentLocation } from "../utils/getCurrentLocation.ts"
import { useNaverMap } from "../hooks/useNaverMap.ts"

interface MapViewProps {
  center: Coordinate
  branches?: Branch[]
  options?: {
    showCurrentLocationButton?: boolean
    showCurrentLocation?: boolean
    onMoveMap?: (coordinate: Coordinate) => void
    onSelectBranch?: (branch: Branch) => void
  }
}

const MapView = ({
  center,
  branches = [],
  options = { showCurrentLocationButton: true },
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  )
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const { isLoaded, error } = useNaverMap()

  const { updateCurrentLocationMarker } = useNaverMapBranchMarkers({
    map: mapInstance.current,
    branches,
    selectedBranchId: selectedBranch?.b_idx
      ? Number(selectedBranch.b_idx)
      : null,
    options: {
      showCurrentLocationMarker: options?.showCurrentLocation,
      onClickMarker: (branch) => {
        setSelectedBranch(branch)
        options?.onSelectBranch?.(branch)

        if (mapInstance.current) {
          mapInstance.current.setCenter(
            new window.naver.maps.LatLng(branch.latitude, branch.longitude),
          )
        }
      },
    },
  })

  useEffect(() => {
    let mounted = true

    const initializeMap = () => {
      if (!mounted || !mapRef.current || !center || !isLoaded) {
        return
      }

      try {
        mapInstance.current = new window.naver.maps.Map("map", {
          center: new window.naver.maps.LatLng(
            center.latitude,
            center.longitude,
          ),
          zoom: 14,
        })

        if (!mounted) return
        setIsMapInitialized(true)

        // 드래그 종료 시에만 위치 업데이트
        if (options?.onMoveMap && mapInstance.current) {
          const map = mapInstance.current
          window.naver.maps.Event.addListener(map, "dragend", () => {
            const center = map.getCenter()
            options?.onMoveMap?.({
              latitude: center.y,
              longitude: center.x,
            })
          })
        }

        if (options?.showCurrentLocation) {
          getCurrentLocation({
            onSuccess: (coords) => {
              if (!mounted) return
              setCurrentLocation(coords)
            },
          })
        }
      } catch (error) {
        // 지도 초기화 중 오류 발생
      }
    }

    if (isLoaded && center) {
      // mapRef가 설정될 때까지 대기
      if (!mapRef.current) {
        const checkMapRef = setInterval(() => {
          if (mapRef.current) {
            clearInterval(checkMapRef)
            initializeMap()
          }
        }, 100)

        return () => {
          clearInterval(checkMapRef)
        }
      }

      initializeMap()
    }

    return () => {
      mounted = false
      if (mapInstance.current) {
        mapInstance.current = null
        setIsMapInitialized(false)
      }
    }
  }, [center, isLoaded])

  useEffect(() => {
    if (isMapInitialized && currentLocation && mapInstance.current) {
      updateCurrentLocationMarker(currentLocation)
    }
  }, [currentLocation, isMapInitialized])

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
          className="absolute bottom-10 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <CrosshairIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default MapView
