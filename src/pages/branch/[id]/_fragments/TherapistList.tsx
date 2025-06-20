import ProfileCard from '@/components/ProfileCard';

const TherapistList = ({
  therapists
}: {
  therapists: {
    name: string;
    profileImageUrl?: string;
    description?: string;
    grade: string;
  }[];
}) => {
  if (!therapists.length) {
    return (
      <div className="flex items-center justify-center p-5">
        <p className="text-gray-500">등록된 테라피스트가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={'flex flex-col items-stretch gap-4 p-5'}>
      {therapists.map((therapist, index) => (
        <ProfileCard key={index} type={'default'} {...therapist} />
      ))}
    </div>
  );
};

export default TherapistList;
