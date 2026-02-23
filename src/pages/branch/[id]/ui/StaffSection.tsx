const StaffSection = ({ directorCount, staffCount }: { directorCount: number; staffCount: number }) => (
  <div className={'flex flex-col items-start gap-2'}>
    <p className={'font-b text-16px'}>{'소속 관리사'}</p>
    <div className={'flex items-center gap-1 font-m text-14px text-gray-500'}>
      <p>{`총 ${directorCount + staffCount}명`}</p>
      {directorCount > 0 && (
        <>
          <div className={'w-0.5 h-0.5 rounded-sm bg-gray-500'} />
          <p>{`원장 ${directorCount}명`}</p>
        </>
      )}
      {staffCount > 0 && (
        <>
          <div className={'w-0.5 h-0.5 rounded-sm bg-gray-500'} />
          <p>{`직원 ${staffCount}명`}</p>
        </>
      )}
    </div>
  </div>
);

export default StaffSection;
