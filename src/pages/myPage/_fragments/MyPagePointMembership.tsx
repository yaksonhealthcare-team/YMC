import { useUserStore } from '@/_domain/auth';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import CrownIcon from '@/assets/icons/CrownIcon.svg?react';
import InformationIcon from '@/assets/icons/InformationIcon.svg?react';
import PersonalCardIcon from '@/assets/icons/PersonalCardIcon.svg?react';
import PointIcon from '@/assets/icons/PointIcon.svg?react';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { Divider, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const MyPagePointMembership = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { openBottomSheet } = useOverlay();

  // const handleOpenQuestionnaire = () => {
  //   openBottomSheet(
  //     <div className="flex flex-col" role="dialog" aria-label="문진 종류 선택">
  //       <div className="px-5 pt-4 pb-8 flex flex-col gap-2 text-center text-18px font-sb text-gray-900">
  //         {'보고 싶은 문진 종류를 선택해주세요.'}
  //       </div>
  //       <div className="pt-3 pb-[30px] border-t border-gray-50">
  //         <div className="px-5 flex gap-3">
  //           <Link
  //             to="/mypage/questionnaire/reservation"
  //             onClick={() => {
  //               closeOverlay();
  //             }}
  //             className="w-full"
  //             aria-label="예약 문진 작성하기"
  //           >
  //             <Button className="w-full" variantType="line" sizeType="l">
  //               {'예약 문진'}
  //             </Button>
  //           </Link>
  //           <Link
  //             to="/mypage/questionnaire/common"
  //             onClick={() => {
  //               closeOverlay();
  //             }}
  //             className="w-full"
  //             aria-label="공통 문진 작성하기"
  //           >
  //             <Button className="w-full" variantType="primary" sizeType="l">
  //               {'공통 문진'}
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const handleOpenUserLevel = () => {
    openBottomSheet(
      <div className={'flex flex-col'} role="dialog" aria-label="회원등급 안내">
        <p className={'font-sb text-18px px-5 pt-4'}>회원등급 안내</p>
        <div className={'px-7 py-6'}>
          <table className={'w-full border-collapse'} role="grid">
            <thead>
              <tr className={'bg-system-bg'} role="row">
                <th
                  className={'p-3 pl-5 text-16px font-medium text-gray-900 text-left w-[100px]'}
                  scope="col"
                  role="columnheader"
                >
                  등급
                </th>
                <th className={'p-3 text-16px font-medium text-gray-900 text-left'} scope="col" role="columnheader">
                  조건
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  VIP
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  오프라인 매장 구매 100만원 이상 고객님
                </td>
              </tr>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  BASIC
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  테라피스트 앱 이용 고객님
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Stack direction="column" gap={0.5} px={4} pb={3}>
          <Typography variant="body2" textAlign="left" color="textSecondary">
            *기본적으로 BASIC 등급이 적용되며 조건 충족 시 상위 등급으로 자동 변경됩니다.
          </Typography>
          <Typography variant="body2" textAlign="left" color="textSecondary">
            *회원 등급은 최근 1년간 약손명가, 여리한 다이어트, 달리아 에스테틱 오프라인 매장 이용 금액 기준으로
            산정됩니다.
          </Typography>
        </Stack>
      </div>
    );
  };

  return (
    <div className="flex gap-2" role="group" aria-label="마이페이지 포인트 및 회원등급">
      <button
        type="button"
        className={clsx(
          'w-[101px] h-24 bg-white rounded-2xl border border-gray-100',
          'flex flex-col items-center justify-center gap-2',
          'hover:bg-gray-50 transition-colors duration-200'
        )}
        onClick={() => navigate('/store')}
      >
        <PersonalCardIcon className="w-6 h-6" aria-hidden="true" />
        <span className="font-m text-14px text-gray-500">스토어</span>
      </button>
      <div className="flex-1 h-24 px-5 py-3 bg-white rounded-2xl border border-gray-100 flex flex-col justify-center gap-2">
        <button
          type="button"
          className={clsx(
            'flex justify-between items-center w-full',
            'hover:bg-gray-50 transition-colors duration-200',
            'rounded-lg p-1'
          )}
          onClick={() => navigate('/point')}
          aria-label={`포인트 ${user?.points ?? 0}P 확인하기`}
        >
          <div className="flex items-center gap-2">
            <PointIcon className="w-4 h-4" aria-hidden="true" />
            <span className="font-m text-14px text-gray-500">포인트</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sb text-16px text-gray-900">{`${(user?.points ?? 0).toLocaleString()}P`}</span>
            <CaretRightIcon className="w-3 h-3" aria-hidden="true" />
          </div>
        </button>
        <Divider className="border-gray-100" role="separator" />
        <button
          type="button"
          className={clsx(
            'flex justify-between items-center w-full',
            'hover:bg-gray-50 transition-colors duration-200',
            'rounded-lg p-1'
          )}
          onClick={handleOpenUserLevel}
        >
          <div className="flex items-center gap-2">
            <CrownIcon className="w-4 h-4" aria-hidden="true" />
            <span className="font-m text-14px text-gray-500">회원등급</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sb text-16px text-gray-900">{user?.level_name ?? 'BASIC'}</span>
            <InformationIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyPagePointMembership;
