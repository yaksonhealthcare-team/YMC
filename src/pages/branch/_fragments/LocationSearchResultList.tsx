import { Location } from "../../../types/Location.ts"
import LocationSearchPlaceholder from "./LocationSearchPlaceholder.tsx"
import PinIcon from "@assets/icons/PinIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"

interface LocationSearchResultListProps {
  type: "saved" | "search"
  locations: Location[]
  onClick: (location: Location) => void
  onDelete?: (id: string) => void
  isSearchFocused?: boolean
}

const LocationSearchResultList = ({
  type,
  locations,
  onClick,
  onDelete,
  isSearchFocused = false,
}: LocationSearchResultListProps) => {
  if (locations.length === 0) {
    return <LocationSearchPlaceholder isSearchFocused={isSearchFocused} />
  }

  return (
    <ul className={"px-5 divide-y divide-gray-100 overflow-y-scroll"}>
      {locations.map((location, index) => (
        <li key={location.csab_idx ?? index} className={"py-4"}>
          <div
            className={"flex items-center gap-2"}
            onClick={() => onClick(location)}
          >
            <PinIcon className={"w-4 h-4"} />
            <div className="flex-1">
              <p className={"font-b text-14px"}>
                {location.name || location.address}
              </p>
              <p className={"text-12px text-gray-500 mt-1"}>
                {location.name ? location.address : ""}
              </p>
            </div>
            {type === "saved" && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDelete(location.b_idx || location.csab_idx!)
                }}
              >
                <HeartEnabledIcon className={"w-5 h-5"} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default LocationSearchResultList
