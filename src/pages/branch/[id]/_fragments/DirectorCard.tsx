const DirectorCard = ({
  name,
  profileImageUrl,
  description,
}: {
  name: string,
  profileImageUrl?: string,
  description?: string,
}) => (
  <div className={"bg-primary-300 p-5 rounded-2xl shadow-md flex justify-between items-center"}>
    <div>
      <p className={"font-b text-18px text-white"}>{name}</p>
      {description && <p className={"font-m text-14px text-white"}>{description}</p>}
    </div>
    {profileImageUrl ?
      <img src={profileImageUrl} alt={"이미지"} /> :
      <PlaceholderProfileImage />
    }
  </div>
)

// TODO: Change to placeholder image after PR #27 merged
const PlaceholderProfileImage = () => (
  <div className={"w-20 h-20 rounded-full bg-gray-500 content-center"}>
    <p className={"text-sm text-center text-white"}>{"Placeholder"}</p>
  </div>
)

export default DirectorCard
