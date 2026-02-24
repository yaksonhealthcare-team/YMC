import BranchIcon from '@/shared/ui/icons/BranchIcon';

const Step3Finish = () => {
  return (
    <div className="h-full bg-white">
      <div className="flex flex-col justify-center items-center px-[20px] pt-[20px] pb-[24px] mt-[100px]">
        <BranchIcon color="#F37165" className="w-[60px] h-[60px] mt-[3px]" />

        <p className="mt-[28px] text-center font-semibold text-[20px]">
          회원정보 연동까지는
          <br />
          2~3일 정도 소요될 수 있습니다
        </p>
      </div>
    </div>
  );
};

export default Step3Finish;
