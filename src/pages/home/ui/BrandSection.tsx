import { SwiperBrandCard } from '@/widgets/brand-swiper/ui/SwiperBrandCard';
import { Title } from '@/shared/ui/Title';
import { useDisplayBrands } from '@/entities/brand/lib/useDisplayBrands';
import { useNavigate } from 'react-router-dom';

export const BrandSection = () => {
  const navigate = useNavigate();
  const { displayedBrands } = useDisplayBrands();

  const handleBrandClick = (brandCode: string, brandName: string) => {
    navigate(`/brand/${brandCode}/${brandName}`);
  };

  // 브랜드 데이터가 없을 경우 렌더링하지 않음
  if (!displayedBrands || displayedBrands.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <Title className="px-5" title="브랜드 관" />
      <SwiperBrandCard className="mt-2 px-5" onBrandClick={handleBrandClick} />
    </div>
  );
};
