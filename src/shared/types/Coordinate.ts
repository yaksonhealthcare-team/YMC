type Coordinate = {
  latitude: number;
  longitude: number;
};

interface GeolocationState {
  location?: Coordinate;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export type { Coordinate, GeolocationOptions, GeolocationState };
