import BranchPlaceholderImage from "@assets/images/BranchPlaceholderImage.png"

interface ProfileCardProps {
  type: "primary" | "default"
  name: string
  profileImageUrl?: string
  description?: string
  grade: string
}

interface ProfileImageProps {
  profileImageUrl?: string
  className?: string
}

const STYLE_VARIANTS = {
  primary: {
    background: "bg-primary-300",
    text: "text-white",
    description: "font-m",
  },
  default: {
    background: "bg-white",
    text: "text-black",
    description: "font-r",
  },
}

const ProfileImage = ({
  profileImageUrl,
  className = "",
}: ProfileImageProps) => (
  <img
    className={`rounded-full h-20 aspect-square object-cover ${className}`}
    src={profileImageUrl || BranchPlaceholderImage}
    alt={"프로필 사진"}
  />
)

const ProfileCard = ({
  type,
  name,
  profileImageUrl,
  description,
  grade,
}: ProfileCardProps) => {
  const styles = STYLE_VARIANTS[type]

  return (
    <div
      className={`${styles.background} p-5 rounded-2xl shadow-md flex justify-between items-center`}
    >
      <div>
        <p className={`font-b text-18px ${styles.text}`}>{name} {grade}</p>
        {description && (
          <p className={`${styles.description} text-14px ${styles.text}`}>
            {description}
          </p>
        )}
      </div>
      <ProfileImage
        className={`${type === "default" ? "border border-gray-200" : undefined}`}
        profileImageUrl={profileImageUrl}
      />
    </div>
  )
}

export default ProfileCard
