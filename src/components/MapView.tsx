import { useEffect, useRef } from "react"
import { Coordinate, DEFAULT_COORDINATE } from "../types/Coordinate.ts"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"

interface MapViewProps {
  currentLocation?: Coordinate
  markers?: (naver.maps.Marker & { onClick: () => void })[]
  options?: {
    showCurrentLocationButton?: boolean
  }
}

const MapView = ({
  currentLocation = DEFAULT_COORDINATE,
  markers = [],
  options = { showCurrentLocationButton: true },
}: MapViewProps) => {
  const { naver } = window
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const markerRefs = useRef<naver.maps.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    mapInstance.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude,
      ),
      zoom: 14,
    })

    return () => {
      markerRefs.current.forEach((marker) => marker.setMap(null))
      markerRefs.current = []
    }
  }, [])

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current) return

    markerRefs.current.forEach((marker) => marker.setMap(null))
    markerRefs.current = []

    markers.forEach((markerData) => {
      const position = markerData.getPosition()
      const marker = new naver.maps.Marker({
        position,
        map: mapInstance.current ?? undefined,
      })

      naver.maps.Event.addListener(marker, "click", () => {
        markerData.onClick()
      })

      markerRefs.current.push(marker)
    })
  }, [markers])

  return (
    <div id={"map"} ref={mapRef} className={"relative w-full h-full"}>
      {options?.showCurrentLocationButton && (
        <button
          className={
            "absolute right-5 bottom-10 z-10 w-10 h-10 bg-white rounded-full items-center justify-center flex shadow-xl"
          }
        >
          <CrosshairIcon />
        </button>
      )}
    </div>
  )
}

export default MapView
