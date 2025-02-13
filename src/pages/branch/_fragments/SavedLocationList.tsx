import {
  useAddressBookmarks,
  useDeleteAddressBookmarkMutation,
} from "../../../queries/useAddressQueries"
import { useNavigate } from "react-router-dom"
import LocationSearchResultList from "./LocationSearchResultList"

const SavedLocationList = () => {
  const navigate = useNavigate()
  const { data: bookmarks = [] } = useAddressBookmarks()
  const { mutate: deleteBookmark } = useDeleteAddressBookmarkMutation()

  return (
    <div className={"flex flex-col py-6 h-full overflow-y-scroll"}>
      <p className={"px-5 font-sb text-16px"}>{"자주 쓰는 주소"}</p>
      <LocationSearchResultList
        type="saved"
        locations={bookmarks}
        onDelete={deleteBookmark}
        onClick={(location) => {
          navigate("/branch", {
            state: {
              selectedLocation: {
                address: location.address,
                coords: {
                  latitude: parseFloat(location.lat),
                  longitude: parseFloat(location.lon),
                },
              },
            },
          })
        }}
      />
    </div>
  )
}

export default SavedLocationList
