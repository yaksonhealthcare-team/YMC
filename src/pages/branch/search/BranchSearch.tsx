import { useEffect, useState } from 'react';
import { useLayout } from '../../../contexts/LayoutContext.tsx';
import ActiveBranchList from './_fragments/ActiveBranchList.tsx';
import BranchSearchResultList from './_fragments/BranchSearchResultList.tsx';
import { SearchField } from '@components/SearchField.tsx';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';

const BranchSearch = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '지점 검색',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-5 pt-5 shrink-0">
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={'지역 또는 지점명을 입력해주세요.'}
        />
      </div>
      <div className="grow overflow-y-auto">
        {query.length === 0 ? (
          <ActiveBranchList />
        ) : (
          <BranchSearchResultList query={debouncedQuery} onSelect={(branch) => navigate(`/branch/${branch.b_idx}`)} />
        )}
      </div>
    </div>
  );
};

export default BranchSearch;
