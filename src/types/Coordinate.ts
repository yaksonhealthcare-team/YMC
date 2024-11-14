type Coordinate = {
  latitude: number | null;
  longitude: number | null;
}

const DEFAULT_COORDINATE: Coordinate = {
  latitude: 37.523040,
  longitude: 127.028841,
}

interface GeolocationState {
  location: Coordinate;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export { DEFAULT_COORDINATE }
export type { Coordinate, GeolocationOptions, GeolocationState }
