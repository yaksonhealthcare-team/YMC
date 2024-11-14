declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions)

      setCenter(location: LatLng): void

      setZoom(level: number, animate?: boolean): void

      addClickListener(target: Marker, listener: EventListener): void
    }

    class LatLng {
      constructor(lat: number, lng: number)

      lat(): number

      lng(): number
    }

    class Marker {
      constructor(options: MarkerOptions)

      setMap(map: Map | null): void

      setIcon(icon: string | ImageIcon): void

      setPosition(position: LatLng): void
    }

    interface MapOptions {
      center?: LatLng
      zoom?: number
      minZoom?: number
      maxZoom?: number
      zoomControl?: boolean
      zoomControlOptions?: {
        position: Position
      }
    }

    interface MarkerOptions {
      position: LatLng
      map?: Map
      title?: string
      icon?: string | ImageIcon
      animation?: Animation
    }

    enum Position {
      TOP = "TOP",
      TOP_LEFT = "TOP_LEFT",
      TOP_RIGHT = "TOP_RIGHT",
      BOTTOM = "BOTTOM",
      BOTTOM_LEFT = "BOTTOM_LEFT",
      BOTTOM_RIGHT = "BOTTOM_RIGHT",
      LEFT = "LEFT",
      RIGHT = "RIGHT",
    }

    interface ImageIcon {
      url: string
      size?: Size
      origin?: Point
      anchor?: Point
    }

    class Size {
      constructor(width: number, height: number)

      width: number
      height: number
    }

    class Point {
      constructor(x: number, y: number)

      x: number
      y: number
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2,
    }

    namespace Event {
      import Marker = naver.maps.Marker
      type EventType = "click"

      interface EventListener {
        (): void
      }

      function addListener(
        target: Map | Marker | InfoWindow,
        eventName: EventType,
        listener: EventListener,
      ): void

      function removeListener(
        target: Map | Marker | InfoWindow,
        eventName: EventType,
        listener: EventListener,
      ): void

      function clearListeners(
        target: Map | Marker | InfoWindow,
        eventName?: EventType,
      ): void
    }
  }
}

declare global {
  interface Window {
    naver: typeof naver
  }
}

declare module "naver-maps" {
  export = naver
}
