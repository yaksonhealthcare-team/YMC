import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"

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

const PlaceholderProfileImage = () => (
  <img
    className={"rounded-full h-20 aspect-square object-cover"}
    src={BranchPlaceholderImage}
    alt={"지점 사진"}
  />
)

export default DirectorCard
