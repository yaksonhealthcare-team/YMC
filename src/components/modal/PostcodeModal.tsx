import DaumPostcode from 'react-daum-postcode';
import { Address } from 'react-daum-postcode/lib/loadPostcode';

interface PostcodeModalProps {
  setIsPostcodeOpen: (isOpen: boolean) => void;
  handleCompletePostcode: (address: Address) => void;
}

const PostcodeModal = ({ setIsPostcodeOpen, handleCompletePostcode }: PostcodeModalProps) => {
  // 주소 선택 완료 시 호출되는 함수
  const onComplete = (address: Address) => {
    // 주소 데이터 처리
    handleCompletePostcode(address);
    // 모달 닫기
    setIsPostcodeOpen(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setIsPostcodeOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="주소 검색"
    >
      <div
        className="w-[90%] max-w-[430px] h-[90%] min-h-[480px] max-h-[530px] bg-white overflow-hidden shadow-md !font-11px"
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <DaumPostcode onComplete={onComplete} style={{ height: '100%' }} />
      </div>
    </div>
  );
};

export default PostcodeModal;
