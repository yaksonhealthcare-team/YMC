import { useGetConsultMenu } from '@/_domain/category/services/queries/menu.queries';
import { useDebounce } from '@/_shared/hooks/useDebounce';
import { useReservationFormStore } from '@/stores/reservationFormStore';
import { useMemo, useState } from 'react';
import { convertConsultMenu, ConvertedConsultMenuData } from '../../business';
import { ConsultMenuChoiceTemplate } from '../templates';

interface ConsultMenuChoicePageProps {
  onBack: () => void;
  onClickCard: (item: ConvertedConsultMenuData[number]) => void;
}

export const ConsultMenuChoicePage = ({ onBack, onClickCard }: ConsultMenuChoicePageProps) => {
  const [search, setSearch] = useState('');

  const { formData } = useReservationFormStore();
  const debouncedValue = useDebounce(search);
  const { data, fetchNextPage, hasNextPage, isPending } = useGetConsultMenu({
    b_idx: formData.branch || '',
    search: debouncedValue
  });
  const consultMenuData = useMemo(() => data?.flatMap((page) => page.data.body), [data]);
  const convertedData = convertConsultMenu(consultMenuData);

  const handleFetch = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <ConsultMenuChoiceTemplate
      data={convertedData}
      search={search}
      isPending={isPending}
      onBack={onBack}
      onNextFetch={handleFetch}
      onClickCard={onClickCard}
      onChangeSearch={handleChangeSearch}
    />
  );
};
