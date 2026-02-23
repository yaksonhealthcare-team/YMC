import { useBranchLocationSelect } from '@/features/search-branch/lib/useBranchLocationSelect';
import { useAddressBookmarks, useDeleteAddressBookmarkMutation } from '@/shared/api/useAddressQueries';
import { useNavigate } from 'react-router-dom';
import LocationSearchPlaceholder from './LocationSearchPlaceholder';
import LocationSearchResultList from './LocationSearchResultList';

interface SavedLocationListProps {
  isSearchFocused?: boolean;
}

const SavedLocationList = ({ isSearchFocused = false }: SavedLocationListProps) => {
  const navigate = useNavigate();
  const { data: bookmarks = [] } = useAddressBookmarks();
  const { mutate: deleteBookmark } = useDeleteAddressBookmarkMutation();
  const { setLocation } = useBranchLocationSelect();

  if (isSearchFocused) {
    return <LocationSearchPlaceholder isSearchFocused={true} />;
  }

  return (
    <div className={'flex flex-col py-6 h-full'}>
      <p className={'px-5 font-sb text-16px'}>{'자주 쓰는 주소'}</p>
      <LocationSearchResultList
        type="saved"
        locations={bookmarks}
        onDelete={(id) => {
          deleteBookmark(id);
        }}
        onClick={(location) => {
          const coords = {
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon)
          };
          setLocation({
            address: location.address,
            coords
          });
          navigate('/branch', {
            state: {
              selectedLocation: {
                address: location.address,
                coords
              }
            }
          });
        }}
        isSearchFocused={false}
      />
    </div>
  );
};

export default SavedLocationList;
