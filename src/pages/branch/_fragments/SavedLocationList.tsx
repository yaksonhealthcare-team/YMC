import {
  useAddressBookmarks,
  useDeleteAddressBookmarkMutation,
} from "../../../queries/useAddressQueries"
import { useNavigate } from "react-router-dom"
import LocationSearchResultList from "./LocationSearchResultList"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect"
import LocationSearchPlaceholder from "./LocationSearchPlaceholder"

interface SavedLocationListProps {
  isSearchFocused?: boolean
}

const SavedLocationList = ({
  isSearchFocused = false,
}: SavedLocationListProps) => {
  const navigate = useNavigate()
  const { data: bookmarks = [] } = useAddressBookmarks()
  const { mutate: deleteBookmark } = useDeleteAddressBookmarkMutation()
  const { setLocation } = useBranchLocationSelect()

  if (isSearchFocused) {
    return <LocationSearchPlaceholder isSearchFocused={true} />
  }

  return (
    <div className={"flex flex-col py-6 h-full overflow-y-scroll"}>
      <p className={"px-5 font-sb text-16px"}>{"자주 쓰는 주소"}</p>
      <LocationSearchResultList
        type="saved"
        locations={bookmarks}
        onDelete={deleteBookmark}
        onClick={(location) => {
          const coords = {
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
          }
          setLocation({
            address: location.address,
            coords,
          })
          navigate("/branch", {
            state: {
              selectedLocation: {
                address: location.address,
                coords,
              },
            },
          })
        }}
        isSearchFocused={false}
      />
    </div>
  )
}

export default SavedLocationList
