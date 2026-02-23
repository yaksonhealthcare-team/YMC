import { useGetTerms } from '@/_domain/auth';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const TermsDetailPage = () => {
  const { id = '' } = useParams();
  const { data: termsData } = useGetTerms({ terms_category_idx: Number(id), is_use: 'Y' }, { enabled: !!id });

  const terms = useMemo(() => termsData?.data.body.terms[0], [termsData?.data.body.terms]);
  const termsList = terms?.terms_list[0];
  if (!terms || !termsList) return null;

  return (
    <>
      <Header />

      <div className="px-5 py-4">
        <div className="mb-6">
          <h1 className="font-b text-2xl">{terms.terms_category_name}</h1>
          <p className="text-gray-500 text-base mt-2">{termsList.terms_sub_title}</p>
          <p className="text-gray-400 text-sm mt-1">버전: {termsList.terms_version || '약관이 없습니다.'}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="whitespace-pre-wrap text-gray-600 text-16px leading-relaxed">{termsList.terms_content}</div>
        </div>

        <p className="text-gray-400 mt-4 text-xs text-right">
          시행일: {new Date(termsList.terms_reg_date).toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default TermsDetailPage;

const Header = () => {
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      left: 'back',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  return null;
};
