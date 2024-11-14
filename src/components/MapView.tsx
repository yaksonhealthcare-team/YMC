import { useCallback, useEffect, useRef, useState } from "react"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { INITIAL_CENTER } from "@constants/LocationConstants.ts"
import { createMarkerIcon } from "../utils/createMarkerIcon.ts"

interface MapViewProps {
  defaultCenter?: {
    lat: number
    lng: number
  }
  initialZoom?: number
  branches?: Branch[]
  onSelectBranch?: (branch: Branch | null) => void
  preventUpdateToCurrentLocation?: boolean
  showCurrentLocationButton?: boolean
}

const MapView = ({
  defaultCenter = INITIAL_CENTER,
  initialZoom = 14,
  branches = [],
  onSelectBranch,
  preventUpdateToCurrentLocation = false,
  showCurrentLocationButton = true,
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const markerInstances = useRef<
    Array<{
      marker: naver.maps.Marker
      branch: Branch
    }>
  >([])
  const currentLocationMarker = useRef<naver.maps.Marker | null>(null)
  const selectedMarker = useRef<naver.maps.Marker | null>(null)
  const [initialCenter, setInitialCenter] = useState(defaultCenter)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const updateCurrentLocationMarker = useCallback(
    (latitude: number, longitude: number) => {
      if (!mapInstance.current) return

      if (currentLocationMarker.current) {
        currentLocationMarker.current.setMap(null)
      }

      const position = new window.naver.maps.LatLng(latitude, longitude)

      currentLocationMarker.current = new window.naver.maps.Marker({
        position,
        map: mapInstance.current,
        icon: createMarkerIcon(null, "current-location"),
      })
    },
    [],
  )

  const getCurrentLocation = useCallback((): Promise<{
    lat: number
    lng: number
  }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
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
  }, [getCurrentLocation, updateCurrentLocationMarker])

  useEffect(() => {
    if (isInitialized || preventUpdateToCurrentLocation) return

    getCurrentLocation()
      .then((position) => {
        setInitialCenter(position)
        updateCurrentLocationMarker(position.lat, position.lng)
      })
      .catch(() => {
        setInitialCenter(defaultCenter)
      })
      .finally(() => {
        setIsInitialized(true)
      })
  }, [
    defaultCenter,
    getCurrentLocation,
    isInitialized,
    preventUpdateToCurrentLocation,
    updateCurrentLocationMarker,
  ])

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return

      const mapOptions = {
        center: new window.naver.maps.LatLng(
          initialCenter.lat,
          initialCenter.lng,
        ),
        zoom: initialZoom,
      }

      mapInstance.current = new window.naver.maps.Map(
        mapRef.current,
        mapOptions,
      )

      // 기존 마커들 제거
      markerInstances.current.forEach(({ marker }) => marker.setMap(null))
      markerInstances.current = []

      branches.forEach((branch) => {
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
            setSelectedBranch(branch)
          })
        }

        markerInstances.current.push({ marker, branch })
      })

      window.naver.maps.Event.addListener(mapInstance.current, "click", () => {
        onSelectBranch?.(null)
        setSelectedBranch(null)
      })
    }

    const script = document.createElement("script")
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    script.async = true
    script.onload = initializeMap
    document.head.appendChild(script)

    return () => {
      markerInstances.current.forEach(({ marker }) => marker.setMap(null))
      if (currentLocationMarker.current) {
        currentLocationMarker.current.setMap(null)
      }
      document.head.removeChild(script)
    }
  }, [initialCenter, initialZoom, branches, isInitialized, onSelectBranch])

  useEffect(() => {
    if (!markerInstances.current.length) return

    // 이전에 선택된 마커가 있다면 원래 아이콘으로 되돌리기
    if (selectedMarker.current) {
      const prevMarkerInfo = markerInstances.current.find(
        ({ marker }) => marker === selectedMarker.current,
      )

      if (prevMarkerInfo) {
        const defaultIcon = createMarkerIcon(prevMarkerInfo.branch, "default")
        prevMarkerInfo.marker.setIcon(defaultIcon)
      }
    }

    // 새로 선택된 마커의 아이콘 변경
    if (selectedBranch) {
      const newMarkerInfo = markerInstances.current.find(
        ({ branch }) => branch.id === selectedBranch.id,
      )

      if (newMarkerInfo) {
        const selectedIcon = createMarkerIcon(selectedBranch, "active")
        newMarkerInfo.marker.setIcon(selectedIcon)
        selectedMarker.current = newMarkerInfo.marker
      }
    } else {
      selectedMarker.current = null
    }
  }, [selectedBranch])

  return (
    <div className="relative flex-1">
      <div className="w-full h-full" ref={mapRef} />
      {showCurrentLocationButton && (
        <button
          onClick={moveToCurrentLocation}
          className={`absolute bottom-10 right-4 bg-white p-2 rounded-full shadow-floatingButton hover:bg-gray-50 flex items-center gap-2 
            ${selectedBranch ? "transition-transform -translate-y-32 duration-300" : "transition-transform translate-y-0 duration-300"}`}
        >
          <CrosshairIcon />
        </button>
      )}
    </div>
  )
}

export default MapView
