import { useCallback, useEffect, useRef } from "react"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"

const CITY_HALL = { lat: 37.5666805, lng: 126.9784147 }

interface MapViewProps {
  initialCenter?: {
    lat: number;
    lng: number;
  };
  initialZoom?: number;
  branches: Branch[];
  onSelectBranch?: (branch: Branch) => void;
}

const MapView = ({
  initialCenter = CITY_HALL,
  initialZoom = 14,
  branches = [],
  onSelectBranch,
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const markerInstances = useRef<naver.maps.Marker[]>([])

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = useCallback(() => {
    if (!mapInstance.current) return

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location = new window.naver.maps.LatLng(latitude, longitude)
          mapInstance.current?.setCenter(location)
          mapInstance.current?.setZoom(15)
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error)
          alert("현재 위치를 가져올 수 없습니다.")
        },
      )
    } else {
      alert("이 브라우저에서는 위치 정보를 사용할 수 없습니다.")
    }
  }, [])

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return

      const mapOptions = {
        center: new window.naver.maps.LatLng(
          initialCenter.lat,
          initialCenter.lng,
        ),
        initialZoom: 1,
      }

      mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions)

      // 기존 마커들 제거
      markerInstances.current.forEach(marker => marker.setMap(null))
      markerInstances.current = []

      // 마커 생성 및 클릭 이벤트 추가
      branches.forEach(branch => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            branch.latitude,
            branch.longitude,
          ),
          map: mapInstance.current ?? undefined,
          title: branch.name,
        })

        if (onSelectBranch) {
          window.naver.maps.Event.addListener(marker, "click", () => {
            onSelectBranch(branch)
          })
        }

        markerInstances.current.push(marker)
      })
    }

    const script = document.createElement("script")
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    script.async = true
    script.onload = initializeMap
    document.head.appendChild(script)

    return () => {
      markerInstances.current.forEach(marker => marker.setMap(null))
      document.head.removeChild(script)
    }
  }, [initialCenter, initialZoom, branches, onSelectBranch])

  return (
    <div className="relative flex-1">
      <div
        className={"w-full h-full"}
        ref={mapRef}
      />
      <button
        onClick={moveToCurrentLocation}
        className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2 z-30"
      >
        <CrosshairIcon />
      </button>
    </div>
  )
}

export default MapView
