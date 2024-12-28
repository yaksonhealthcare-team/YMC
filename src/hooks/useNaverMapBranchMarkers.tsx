import { Branch } from "../types/Branch.ts"
import { Coordinate } from "../types/Coordinate.ts"
import { useCallback, useEffect, useRef, useState } from "react"
import { createMarkerIcon, MarkerState } from "../utils/createMarkerIcon.ts"

interface UseNaverMapBranchMarkersProps {
  map: naver.maps.Map | null
  branches: Branch[]
  selectedBranchId?: string
  options?: {
    onClickMarker?: (branch: Branch) => void
    onClickMap?: () => void
    onMove?: (center: Coordinate) => void
  }
}

export const useNaverMapBranchMarkers = ({
  map,
  branches,
  selectedBranchId,
  options,
}: UseNaverMapBranchMarkersProps) => {
  const [markers, setMarkers] = useState<Map<string, naver.maps.Marker>>(
    new Map(),
  )
  const [currentLocationMarker, setCurrentLocationMarker] =
    useState<naver.maps.Marker | null>(null)
  const listenersRef = useRef<naver.maps.MapEventListener[]>([])

  const initializeMarkers = useCallback(() => {
    markers.forEach((marker) => marker.setMap(null))
  }, [markers])

  const getMarkerState = (branch: Branch): MarkerState => {
    if (branch.id === selectedBranchId) {
      return branch.isFavorite ? "active-bookmark" : "active"
    }
    return branch.isFavorite ? "bookmark" : "default"
  }

  // Set branch markers
  useEffect(() => {
    if (!map) return

    initializeMarkers()
    const newMarkers = new Map<string, naver.maps.Marker>()

    branches.forEach((branch) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(branch.latitude, branch.longitude),
        map,
        icon: createMarkerIcon(branch, getMarkerState(branch)),
      })

      if (options?.onClickMarker) {
        naver.maps.Event.addListener(marker, "click", () => {
          options.onClickMarker?.(branch)
        })
      }

      newMarkers.set(branch.id, marker)
    })
    setMarkers(newMarkers)

    return () => initializeMarkers()
  }, [map, branches, selectedBranchId])

  // set event handlers
  useEffect(() => {
    if (!map) return

    if (options?.onClickMap) {
      const listener = naver.maps.Event.addListener(
        map,
        "click",
        options.onClickMap,
      )
      listenersRef.current.push(listener)
    }

    if (options?.onMove) {
      const listener = naver.maps.Event.addListener(map, "dragend", (event) => {
        options.onMove?.({
          latitude: event.latlng.lat(),
          longitude: event.latlng.lng(),
        })
      })
      listenersRef.current.push(listener)
    }

    const listeners = listenersRef.current
    return () => naver.maps.Event.removeListener(listeners)
  }, [map])

  const updateCurrentLocationMarker = (currentLocation: Coordinate) => {
    if (!map) return

    currentLocationMarker?.setMap(null)
    setCurrentLocationMarker(null)

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude,
      ),
      map,
      icon: createMarkerIcon(null, "current-location"),
    })

    setCurrentLocationMarker(marker)

    return () => marker.setMap(null)
  }

  return {
    markers,
    updateCurrentLocationMarker,
  }
}
