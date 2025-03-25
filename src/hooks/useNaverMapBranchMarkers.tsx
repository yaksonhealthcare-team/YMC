import { Branch } from "../types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { useEffect, useRef } from "react"

interface UseNaverMapBranchMarkersProps {
  map: naver.maps.Map | null
  branches: Branch[]
  selectedBranchId?: number | null
  options?: {
    showCurrentLocationMarker?: boolean
    onClickMarker?: (branch: Branch) => void
  }
}

export const useNaverMapBranchMarkers = ({
  map,
  branches,
  selectedBranchId,
  options = {},
}: UseNaverMapBranchMarkersProps) => {
  const markersRef = useRef<naver.maps.Marker[]>([])
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null)
  const eventListenersRef = useRef<naver.maps.MapEventListener[]>([])

  useEffect(() => {
    if (!map || !window.naver?.maps) {
      console.log("지도 또는 네이버 지도 API가 초기화되지 않았습니다.")
      return
    }

    const clearMarkers = () => {
      try {
        markersRef.current.forEach((marker) => {
          if (marker && marker.getMap()) {
            marker.setMap(null)
          }
        })
        markersRef.current = []

        if (
          currentLocationMarkerRef.current &&
          currentLocationMarkerRef.current.getMap()
        ) {
          currentLocationMarkerRef.current.setMap(null)
          currentLocationMarkerRef.current = null
        }
      } catch (error) {
        console.error("마커 정리 중 오류 발생:", error)
      }
    }

    const clearEventListeners = () => {
      try {
        eventListenersRef.current.forEach((listener) => {
          if (map && window.naver?.maps) {
            window.naver.maps.Event.removeListener(listener)
          }
        })
        eventListenersRef.current = []
      } catch (error) {
        console.error("이벤트 리스너 정리 중 오류 발생:", error)
      }
    }

    const initializeMarkers = () => {
      clearMarkers()
      clearEventListeners()

      branches.forEach((branch) => {
        try {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(
              branch.latitude,
              branch.longitude,
            ),
            map,
            icon: {
              content: `<div class="w-6 h-6 bg-white rounded-full border-2 border-primary flex items-center justify-center ${
                Number(branch.b_idx) === selectedBranchId ? "border-2" : ""
              }">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
              </div>`,
              anchor: new window.naver.maps.Point(12, 12),
            },
          })

          if (options.onClickMarker) {
            const listener = window.naver.maps.Event.addListener(
              marker,
              "click",
              () => {
                options.onClickMarker?.(branch)
              },
            )
            eventListenersRef.current.push(listener)
          }

          markersRef.current.push(marker)
        } catch (error) {
          console.error("마커 초기화 중 오류 발생:", error)
        }
      })
    }

    initializeMarkers()

    return () => {
      clearMarkers()
      clearEventListeners()
    }
  }, [map, branches, selectedBranchId, options.onClickMarker])

  const updateCurrentLocationMarker = (coordinate: Coordinate) => {
    if (!map || !window.naver?.maps) {
      console.log("지도 또는 네이버 지도 API가 초기화되지 않았습니다.")
      return
    }

    try {
      if (
        currentLocationMarkerRef.current &&
        currentLocationMarkerRef.current.getMap()
      ) {
        currentLocationMarkerRef.current.setMap(null)
      }

      currentLocationMarkerRef.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          coordinate.latitude,
          coordinate.longitude,
        ),
        map,
        icon: {
          content: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
          anchor: new window.naver.maps.Point(12, 12),
        },
      })
    } catch (error) {
      console.error("현재 위치 마커 업데이트 중 오류 발생:", error)
    }
  }

  return { updateCurrentLocationMarker }
}
