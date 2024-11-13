import { useCallback, useEffect, useRef, useState } from "react"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { INITIAL_CENTER } from "@constants/LocationConstants.ts"
import { createMarkerIcon } from "../utils/createMarkerIcon.ts"

interface MapViewProps {
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  initialZoom?: number;
  branches: Branch[];
  onSelectBranch?: (branch: Branch) => void;
}

const MapView = ({
  defaultCenter = INITIAL_CENTER,
  initialZoom = 14,
  branches = [],
  onSelectBranch,
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const markerInstances = useRef<naver.maps.Marker[]>([])
  const currentLocationMarker = useRef<naver.maps.Marker | null>(null)
  const [initialCenter, setInitialCenter] = useState(defaultCenter)
  const [isInitialized, setIsInitialized] = useState(false)

  const updateCurrentLocationMarker = useCallback((latitude: number, longitude: number) => {
    if (!mapInstance.current) return

    const position = new window.naver.maps.LatLng(latitude, longitude)

    if (currentLocationMarker.current) {
      currentLocationMarker.current.setPosition(position)
    } else {
      currentLocationMarker.current = new window.naver.maps.Marker({
        position,
        map: mapInstance.current,
        icon: createMarkerIcon(null, "current-location"),
      })
    }
  }, [])

  const getCurrentLocation = useCallback((): Promise<{ lat: number, lng: number }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.warn("위치 정보를 가져올 수 없습니다:", error)
            reject(error)
          },
          { timeout: 5000 },
        )
      } else {
        reject(new Error("Geolocation is not supported"))
      }
    })
  }, [])

  const moveToCurrentLocation = useCallback(async () => {
    if (!mapInstance.current) return

    try {
      const { lat, lng } = await getCurrentLocation()
      const location = new window.naver.maps.LatLng(lat, lng)
      mapInstance.current.setCenter(location)
      mapInstance.current.setZoom(15)
      updateCurrentLocationMarker(lat, lng)
    } catch (error) {
      console.warn("현재 위치로 이동할 수 없습니다:", error)
      alert("현재 위치를 가져올 수 없습니다.")
    }
  }, [getCurrentLocation])

  useEffect(() => {
    if (isInitialized) return

    getCurrentLocation()
      .then(position => {
        setInitialCenter(position)
      })
      .catch(() => {
        setInitialCenter(defaultCenter)
      })
      .finally(() => {
        setIsInitialized(true)
      })
  }, [defaultCenter, isInitialized])

  // 지도 초기화
  useEffect(() => {
    if (!isInitialized) return

    const initializeMap = () => {
      if (!mapRef.current) return

      const mapOptions = {
        center: new window.naver.maps.LatLng(
          initialCenter.lat,
          initialCenter.lng,
        ),
      }

      mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions)

      updateCurrentLocationMarker(initialCenter.lat, initialCenter.lng)
      markerInstances.current.forEach(marker => marker.setMap(null))
      markerInstances.current = []

      branches.forEach(branch => {
        const markerIcon = createMarkerIcon(branch, "default")

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            branch.latitude,
            branch.longitude,
          ),
          map: mapInstance.current ?? undefined,
          title: branch.name,
          icon: markerIcon,
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
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    script.async = true
    script.onload = initializeMap
    document.head.appendChild(script)

    return () => {
      markerInstances.current.forEach(marker => marker.setMap(null))
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setMap(null)
      }
      document.head.removeChild(script)
    }
  }, [initialCenter, initialZoom, branches, onSelectBranch, isInitialized])

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
