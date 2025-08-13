import { useUserStore } from '@/_domain/auth';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import CrownIcon from '@/assets/icons/CrownIcon.svg?react';
import InformationIcon from '@/assets/icons/InformationIcon.svg?react';
import PersonalCardIcon from '@/assets/icons/PersonalCardIcon.svg?react';
import PointIcon from '@/assets/icons/PointIcon.svg?react';
import { Button } from '@/components/Button';
import { useOverlay } from '@/stores/ModalContext';
import { Divider } from '@mui/material';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';

const MyPagePointMembership = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { openBottomSheet, closeOverlay } = useOverlay();

  const handleOpenQuestionnaire = () => {
    openBottomSheet(
      <div className="flex flex-col" role="dialog" aria-label="문진 종류 선택">
        <div className="px-5 pt-4 pb-8 flex flex-col gap-2 text-center text-18px font-sb text-gray-900">
          {'보고 싶은 문진 종류를 선택해주세요.'}
        </div>
        <div className="pt-3 pb-[30px] border-t border-gray-50">
          <div className="px-5 flex gap-3">
            <Link
              to="/mypage/questionnaire/reservation"
              onClick={() => {
                closeOverlay();
              }}
              className="w-full"
              aria-label="예약 문진 작성하기"
            >
              <Button className="w-full" variantType="line" sizeType="l">
                {'예약 문진'}
              </Button>
            </Link>
            <Link
              to="/mypage/questionnaire/common"
              onClick={() => {
                closeOverlay();
              }}
              className="w-full"
              aria-label="공통 문진 작성하기"
            >
              <Button className="w-full" variantType="primary" sizeType="l">
                {'공통 문진'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

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
                  최근 1년간 누적 결제 금액
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  Prestige
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  1,000만원 이상
                </td>
              </tr>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  Black
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  300만원 이상
                </td>
              </tr>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  Standard
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  150만원 이상
                </td>
              </tr>
              <tr className={'border-b border-gray-100'} role="row">
                <td className={'p-3 pl-5 text-16px text-left w-[100px]'} role="gridcell">
                  Basic
                </td>
                <td className={'p-3 text-16px text-left'} role="gridcell">
                  0원 이상 150만원 미만
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
          '',
          'hover:bg-gray-50 transition-colors duration-200'
        )}
        onClick={handleOpenQuestionnaire}
        aria-label="내 문진 작성하기"
      >
        <PersonalCardIcon className="w-6 h-6" aria-hidden="true" />
        <span className="font-m text-14px text-gray-500">내 문진</span>
      </button>
      <div className="flex-1 h-24 px-5 py-3 bg-white rounded-2xl border border-gray-100 flex flex-col justify-center gap-2">
        <button
          type="button"
          className={clsx(
            'flex justify-between items-center w-full',
            '',
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
            '',
            'hover:bg-gray-50 transition-colors duration-200',
            'rounded-lg p-1'
          )}
          onClick={handleOpenUserLevel}
          aria-label={`회원등급 ${user?.level_name ?? 'Basic'} 안내`}
        >
          <div className="flex items-center gap-2">
            <CrownIcon className="w-4 h-4" aria-hidden="true" />
            <span className="font-m text-14px text-gray-500">회원등급</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sb text-16px text-gray-900">{user?.level_name ?? 'Basic'}</span>
            <InformationIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyPagePointMembership;
