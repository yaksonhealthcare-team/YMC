import LoadingIndicator from '@/components/LoadingIndicator';
import { Image } from '@/components/common/Image';
import { MembershipCard } from '@/pages/membership/_fragments/MembershipCard';
import { useMembershipCategories, useMembershipList } from '@/queries/useMembershipQueries';
import { MembershipCategory } from '@/types/Membership';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProgramListProps {
  brandCode: string;
}

const CareProgramTabItem = ({
  program,
  isSelected,
  onSelect
}: {
  program: MembershipCategory;
  isSelected: boolean;
  onSelect: (program: MembershipCategory) => void;
}) => {
  const renderBackground = () => {
    if (isSelected) {
      return <div className={'w-[68px] h-[68px] rounded-full bg-primary'} />;
    }
    return program.sc_pic ? (
      <div className={'w-[68px] h-[68px] rounded-full overflow-hidden relative'}>
        <Image src={program.sc_pic} alt={'배경'} className={'w-full h-full object-cover'} />
        <div
          className="absolute inset-0 bg-[rgba(33,33,33,0.42)]"
          style={{
            borderRadius: '99px',
            background: 'linear-gradient(0deg, rgba(33, 33, 33, 0.42) 0%, rgba(33, 33, 33, 0.42) 100%)'
          }}
        />
      </div>
    ) : (
      <div className={'w-[68px] h-[68px] rounded-full bg-[rgba(33,33,33,0.45)]'} />
    );
  };

  return (
    <li className={'relative w-[68px] h-[68px] rounded-full cursor-pointer'} onClick={() => onSelect(program)}>
      {renderBackground()}
      <div className={'absolute w-[68px] z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'}>
        <p className={'text-xs font-medium text-white text-center'}>{program.sc_name}</p>
      </div>
    </li>
  );
};

const ProgramList = ({ brandCode }: ProgramListProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: categoriesData } = useMembershipCategories(brandCode);
  const [selectedProgram, setSelectedProgram] = useState<MembershipCategory | null>(null);

  const { data: memberships, isLoading } = useMembershipList(brandCode, id, selectedProgram?.sc_code);

  // 컴포넌트 마운트 시 첫 번째 카테고리 선택
  useEffect(() => {
    if (categoriesData?.body && categoriesData.body.length > 0 && !selectedProgram) {
      setSelectedProgram(categoriesData.body[0]);
    }
  }, [categoriesData?.body]);

  const handleProgramSelect = (program: MembershipCategory) => {
    setSelectedProgram(program);
  };

  if (!categoriesData?.body || categoriesData.body.length === 0) {
    return null;
  }

  const renderMembershipList = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    const membershipList = memberships?.pages[0]?.body;
    if (!membershipList || membershipList.length === 0) {
      return <div className="px-5 py-4 text-center text-gray-500">회원권이 없습니다.</div>;
    }

    return (
      <div className="px-5 space-y-3 pb-[24px]">
        {membershipList.map((membership) => (
          <MembershipCard
            key={membership.s_idx}
            membership={membership}
            onClick={() => navigate(`/membership/${membership.s_idx}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pt-6">
      <ul className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-5 pr-10">
        {categoriesData.body.map((program) => (
          <CareProgramTabItem
            key={program.sc_code}
            program={program}
            isSelected={selectedProgram?.sc_code === program.sc_code}
            onSelect={handleProgramSelect}
          />
        ))}
      </ul>
      {renderMembershipList()}
    </div>
  );
};

export default ProgramList;
