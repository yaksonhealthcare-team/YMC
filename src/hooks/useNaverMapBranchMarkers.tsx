import { Branch } from '@/types/Branch';
import { Coordinate } from '@/types/Coordinate';
import { useEffect, useRef } from 'react';
import { createMarkerIcon, MarkerState } from '../utils/createMarkerIcon';

interface UseNaverMapBranchMarkersProps {
  map: naver.maps.Map | null;
  branches: Branch[];
  selectedBranchId?: number | null;
  options?: {
    showCurrentLocationMarker?: boolean;
    onClickMarker?: (branch: Branch) => void;
    useStaticPinIcon?: boolean;
  };
}

export const useNaverMapBranchMarkers = ({
  map,
  branches,
  selectedBranchId,
  options = {}
}: UseNaverMapBranchMarkersProps) => {
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const eventListenersRef = useRef<naver.maps.MapEventListener[]>([]);

  useEffect(() => {
    if (!map || !window.naver?.maps) {
      return;
    }

    const clearMarkers = () => {
      try {
        markersRef.current.forEach((marker) => {
          if (marker && marker.getMap()) {
            marker.setMap(null);
          }
        });
        markersRef.current = [];

        if (currentLocationMarkerRef.current && currentLocationMarkerRef.current.getMap()) {
          currentLocationMarkerRef.current.setMap(null);
          currentLocationMarkerRef.current = null;
        }
      } catch {
        // 마커 정리 중 오류 발생
      }
    };

    const clearEventListeners = () => {
      try {
        eventListenersRef.current.forEach((listener) => {
          if (map && window.naver?.maps) {
            window.naver.maps.Event.removeListener(listener);
          }
        });
        eventListenersRef.current = [];
      } catch {
        // 이벤트 리스너 정리 중 오류 발생
      }
    };

    const initializeMarkers = () => {
      clearMarkers();
      clearEventListeners();

      branches.forEach((branch) => {
        try {
          // Determine marker state based on selection and favorite status
          const isActive = Number(branch.b_idx) === selectedBranchId;
          const isBookmarked = branch.isFavorite ?? false;

          let markerState: MarkerState = 'default';
          if (isActive && isBookmarked) {
            markerState = 'active-bookmark';
          } else if (isActive) {
            markerState = 'active';
          } else if (isBookmarked) {
            markerState = 'bookmark';
          }

          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(branch.latitude, branch.longitude),
            map,
            icon: options.useStaticPinIcon
              ? createMarkerIcon(null, 'location-selector')
              : createMarkerIcon(branch, markerState)
          });

          if (options.onClickMarker) {
            const listener = window.naver.maps.Event.addListener(marker, 'click', () => {
              options.onClickMarker?.(branch);
            });
            eventListenersRef.current.push(listener);
          }

          markersRef.current.push(marker);
        } catch {
          // 마커 초기화 중 오류 발생
        }
      });
    };

    initializeMarkers();

    return () => {
      clearMarkers();
      clearEventListeners();
    };
  }, [map, branches, selectedBranchId]);

  const updateCurrentLocationMarker = (coordinate: Coordinate) => {
    if (!map || !window.naver?.maps) {
      return;
    }

    try {
      if (currentLocationMarkerRef.current && currentLocationMarkerRef.current.getMap()) {
        currentLocationMarkerRef.current.setMap(null);
      }

      currentLocationMarkerRef.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(coordinate.latitude, coordinate.longitude),
        map,
        icon: createMarkerIcon(null, 'current-location')
      });
    } catch {
      // 현재 위치 마커 업데이트 중 오류 발생
    }
  };

  return { updateCurrentLocationMarker };
};
