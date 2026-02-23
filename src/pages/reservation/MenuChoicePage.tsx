import {
  convertConsultMenu,
  ConvertedConsultMenuData,
  convertPrepaidMenu,
  MenuCardProps,
  MenuChoiceTemplate,
  useUserStore
} from '@/_domain';
import { ConsultMenuParams, PrepaidMenuParams, useGetConsultMenu, useGetPrepaidMenu } from '@/_domain/category';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useMemo, useState } from 'react';

export interface MenuChoicePageProps {
  onBack: () => void;
  onClickCard: (item: ConvertedConsultMenuData[number]) => void;
  fetchParams: ConsultMenuParams | PrepaidMenuParams;
  type?: MenuCardProps['type'];
}

const MenuChoicePage = ({ onBack, onClickCard, fetchParams, type = 'standard' }: MenuChoicePageProps) => {
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const isConsult = type === 'standard' && 'b_idx' in fetchParams;
  const isPrepaid = type === 'pre-paid' && 'mp_idx' in fetchParams;

  const [search, setSearch] = useState('');
  const debouncedValue = useDebounce(search);

  const {
    data: consultData,
    fetchNextPage: consultFetchNextPage,
    hasNextPage: consultHasNextPage,
    isPending: consultIsPending
  } = useGetConsultMenu(
    userId,
    {
      b_idx: isConsult ? fetchParams.b_idx : '',
      search: debouncedValue
    },
    { enabled: type === 'standard' && !!userId, initialPageParam: 1 }
  );
  const {
    data: prepaidData,
    fetchNextPage: prepaidFetchNextPage,
    hasNextPage: prepaidHasNextPage,
    isPending: prepaidIsPending
  } = useGetPrepaidMenu(
    userId,
    { mp_idx: isPrepaid ? fetchParams.mp_idx : '', search: debouncedValue },
    { enabled: type === 'pre-paid' && !!userId, initialPageParam: 1 }
  );

  const consultMenuData = useMemo(() => consultData?.flatMap((page) => page.data.body), [consultData]);
  const prepaidMenuData = useMemo(() => prepaidData?.flatMap((page) => page.data.body), [prepaidData]);

  const convertedData = convertConsultMenu(consultMenuData);
  const convertedPrepaidData = convertPrepaidMenu(prepaidMenuData);

  const handleFetch = () => {
    if (type === 'standard' && consultHasNextPage) {
      consultFetchNextPage();
    } else if (type === 'pre-paid' && prepaidHasNextPage) {
      prepaidFetchNextPage();
    }
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  const selectData = () => {
    if (type === 'standard') {
      return convertedData;
    } else if (type === 'pre-paid') {
      return convertedPrepaidData;
    }
    return [];
  };

  const selectPending = () => {
    if (type === 'standard') {
      return consultIsPending;
    } else if (type === 'pre-paid') {
      return prepaidIsPending;
    }
    return false;
  };

  return (
    <MenuChoiceTemplate
      data={selectData()}
      search={search}
      isPending={selectPending()}
      onBack={onBack}
      onNextFetch={handleFetch}
      onClickCard={onClickCard}
      onChangeSearch={handleChangeSearch}
      type={type}
    />
  );
};

export default MenuChoicePage;
