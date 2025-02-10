import { useEffect, useRef, useState } from "react"
import { Coordinate } from "../types/Coordinate.ts"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { useNaverMapBranchMarkers } from "../hooks/useNaverMapBranchMarkers.tsx"
import { getCurrentLocation } from "../utils/getCurrentLocation.ts"
import clsx from "clsx"

interface MapViewProps {
  center?: Coordinate
  branches?: Branch[]
  options?: {
    showCurrentLocationButton?: boolean
    showCurrentLocation?: boolean
    onSelectBranch?: (branch: Branch | null) => void
    onMoveMap?: (center: Coordinate) => void
    currentLocationButtonClassName?: string
  }
}

const MapView = ({
  center,
  branches = [],
  options = { showCurrentLocationButton: true },
}: MapViewProps) => {
  const { naver } = window
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<naver.maps.Map | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  )

  const { updateCurrentLocationMarker } = useNaverMapBranchMarkers({
    map: mapInstance.current,
    branches,
    selectedBranchId: selectedBranch?.b_idx,
    options: {
      showCurrentLocationMarker: options?.showCurrentLocation,
      onClickMarker: (branch) => {
        setSelectedBranch(branch)
        options?.onSelectBranch?.(branch)

        if (mapInstance.current) {
          mapInstance.current.setCenter(
            new naver.maps.LatLng(branch.latitude, branch.longitude),
          )
        }
      },
    },
  })

  useEffect(() => {
    if (!mapRef.current || !center) return

    mapInstance.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(center.latitude, center.longitude),
      zoom: 14,
    })

    // 드래그 종료 시에만 위치 업데이트
    if (options?.onMoveMap && mapInstance.current) {
      const map = mapInstance.current
      naver.maps.Event.addListener(map, "dragend", () => {
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
          setCurrentLocation(coords)
        },
      })
    }

    return () => {
      mapInstance.current = null
    }
  }, [center])

  useEffect(() => {
    if (currentLocation) updateCurrentLocationMarker(currentLocation)
  }, [currentLocation])

  const moveToCurrentLocation = () => {
    getCurrentLocation({
      onSuccess: (coords) => {
        if (!mapInstance.current) return
        mapInstance.current.setCenter(
          new naver.maps.LatLng(coords.latitude, coords.longitude),
        )
        mapInstance.current.setZoom(15)
        setCurrentLocation(coords)
        updateCurrentLocationMarker(coords)
        options?.onMoveMap?.(coords)
      },
    })
  }

  if (!center) return null

  return (
    <div id={"map"} ref={mapRef} className={"relative w-full h-full"}>
      {options?.showCurrentLocationButton && (
        <button
          className={clsx(
            `absolute right-5 bottom-10 z-10 w-10 h-10 bg-white rounded-full items-center justify-center flex shadow-xl ${selectedBranch ? "transition-transform -translate-y-32 duration-300" : "transition-transform translate-y-0 duration-300"}`,
            options.currentLocationButtonClassName || "",
          )}
          onClick={moveToCurrentLocation}
        >
          <CrosshairIcon />
        </button>
      )}
    </div>
  )
}

export default MapView
