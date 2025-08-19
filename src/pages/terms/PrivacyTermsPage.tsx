import LoadingIndicator from '@/components/LoadingIndicator';
import { useLayout } from '@/stores/LayoutContext';
import { useTermsByCategory } from '@/hooks/useTerms';
import { useEffect, useRef } from 'react';

const PrivacyTermsPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: termsData, isLoading } = useTermsByCategory(2); // 2: 개인정보 수집 이용

  useEffect(() => {
    setHeader({
      left: 'back',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  if (isLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  const categoryTerms = termsData?.terms?.find((category) => category.terms_category_idx === '2');
  const terms = categoryTerms?.terms_list?.[0];

  return (
    <div ref={contentRef} className={'px-5 py-4'}>
      <div className="mb-6">
        <h1 className={'font-b text-24px text-gray-900'}>
          {terms?.terms_title || categoryTerms?.terms_category_name || '개인정보 수집 이용'}
        </h1>
        {terms?.terms_sub_title && <p className={'text-gray-500 mt-2 text-16px'}>{terms.terms_sub_title}</p>}
        {terms?.terms_version && <p className={'text-gray-400 mt-1 text-14px'}>버전: {terms.terms_version}</p>}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="whitespace-pre-wrap text-gray-600 text-16px leading-relaxed">
          {terms?.terms_content || '약관이 없습니다.'}
        </div>
      </div>

      {terms?.terms_reg_date && (
        <p className="text-gray-400 mt-4 text-12px text-right">
          시행일: {new Date(terms.terms_reg_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default PrivacyTermsPage;
