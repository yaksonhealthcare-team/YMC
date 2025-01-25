import ProfileCard from "@components/ProfileCard.tsx"

const TherapistList = ({
  therapists,
}: {
  therapists: {
    name: string
    profileImageUrl?: string
    description?: string
    grade: string
  }[]
}) => (
  <div className={"flex flex-col items-stretch gap-4 p-5"}>
    {therapists.map((therapist, index) => (
      <ProfileCard key={index} type={"default"} {...therapist} />
    ))}
  </div>
)

export default TherapistList
