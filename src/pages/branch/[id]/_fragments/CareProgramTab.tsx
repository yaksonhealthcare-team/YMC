import { useEffect, useState } from 'react';
import { ServiceCategory } from 'types/Membership';

const CareProgramTabItem = ({
  program,
  isSelected,
  onSelect
}: {
  program: ServiceCategory;
  isSelected: boolean;
  onSelect: (program: ServiceCategory) => void;
}) => {
  const renderBackground = () => {
    if (isSelected) {
      return <div className={'w-[68px] h-[68px] rounded-full bg-primary'} />;
    }
    return program.serviceCategoryImageUrl ? (
      <div className="w-[68px] h-[68px] rounded-full overflow-hidden relative">
        <img src={program.serviceCategoryImageUrl} alt={'배경'} className={'w-full h-full object-cover'} />
        <div
          className="absolute inset-0 bg-[rgba(33,33,33,0.42)]"
          style={{
            borderRadius: '99px',
            background: 'linear-gradient(0deg, rgba(33, 33, 33, 0.42) 0%, rgba(33, 33, 33, 0.42) 100%)'
          }}
        />
      </div>
    ) : (
      <div className={'w-[68px] h-[68px] rounded-full bg-gray-600'} />
    );
  };

  return (
    <li className={'relative w-[68px] h-[68px] rounded-full cursor-pointer'} onClick={() => onSelect(program)}>
      {renderBackground()}
      <div className={'absolute w-[68px] z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'}>
        <p className={'text-xs font-medium text-white text-center'}>{program.serviceCategoryName}</p>
      </div>
    </li>
  );
};

interface CareProgramTabProps {
  programs?: ServiceCategory[];
}

const CareProgramTab = ({ programs = [] }: CareProgramTabProps) => {
  const [selectedProgram, setSelectedProgram] = useState<ServiceCategory | null>(null);

  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0]);
    }
  }, [programs]);

  if (programs.length === 0) return null;

  return (
    <ul
      className={'flex overflow-x-scroll mt-6 gap-2 px-5'}
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      {programs?.map((program) => (
        <CareProgramTabItem
          key={program.serviceCategoryCode}
          program={program}
          isSelected={selectedProgram?.serviceCategoryCode === program.serviceCategoryCode}
          onSelect={setSelectedProgram}
        />
      ))}
    </ul>
  );
};

export { CareProgramTab, CareProgramTabItem };
