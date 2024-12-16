import { useEffect, useRef, useState } from "react"
import { Coordinate, DEFAULT_COORDINATE } from "../types/Coordinate.ts"
import CrosshairIcon from "@assets/icons/CrosshairIcon.svg?react"
import { Branch } from "../types/Branch.ts"
import { useNaverMapBranchMarkers } from "../hooks/useNaverMapBranchMarkers.tsx"
import { getCurrentLocation } from "../utils/getCurrentLocation.ts"

interface MapViewProps {
  center?: Coordinate
  branches?: Branch[]
  options?: {
    showCurrentLocationButton?: boolean
    onSelectBranch?: (branch: Branch | null) => void
    onMoveMap?: (center: Coordinate) => void
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
  const [isMoved, setIsMoved] = useState(false)

  const { updateCurrentLocationMarker } = useNaverMapBranchMarkers({
    map: mapInstance.current,
    branches,
    selectedBranchId: selectedBranch?.id,
    options: {
      onClickMarker: (branch) => {
        setSelectedBranch(branch)
        options?.onSelectBranch?.(branch)

        if (mapInstance.current) {
          mapInstance.current.setCenter(
            new naver.maps.LatLng(branch.latitude, branch.longitude),
          )
        }
      },
      onClickMap: () => {
        setSelectedBranch(null)
        options?.onSelectBranch?.(null)
      },
      onMove: (center) => {
        setIsMoved(true)
        options?.onMoveMap?.(center)
      },
    },
  })

  useEffect(() => {
    if (!mapRef.current) return

    mapInstance.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(
        center?.latitude || DEFAULT_COORDINATE.latitude,
        center?.longitude || DEFAULT_COORDINATE.longitude,
      ),
      zoom: 14,
    })

    moveToCurrentLocation()

    return () => {
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (currentLocation) updateCurrentLocationMarker(currentLocation)
  }, [currentLocation])

  const moveToCurrentLocation = () => {
    getCurrentLocation({
      onSuccess: (coords) => {
        if (isMoved || !mapInstance.current || !location) return
        mapInstance.current.setCenter(
          new naver.maps.LatLng(coords.latitude, coords.longitude),
        )
        mapInstance.current.setZoom(15)
        setCurrentLocation(coords)
        updateCurrentLocationMarker(coords)
      },
    })
  }

  return (
    <div id={"map"} ref={mapRef} className={"relative w-full h-full"}>
      {options?.showCurrentLocationButton && (
        <button
          className={`absolute right-5 bottom-10 z-10 w-10 h-10 bg-white rounded-full items-center justify-center flex shadow-xl ${selectedBranch ? "transition-transform -translate-y-32 duration-300" : "transition-transform translate-y-0 duration-300"}`}
          onClick={moveToCurrentLocation}
        >
          <CrosshairIcon />
        </button>
      )}
    </div>
  )
}

export default MapView
