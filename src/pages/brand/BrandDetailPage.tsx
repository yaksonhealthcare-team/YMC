import { Button } from '@/shared/ui/button/Button';
import { Image } from '@/shared/ui/image/Image';
import FullPageLoading from '@/shared/ui/loading/FullPageLoading';
import { useLayout } from '@/stores/LayoutContext';
import { useBrand } from '@/entities/brand/api/useBrandQueries';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const BrandDetailPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const { brandCode, brandName } = useParams();
  const { data: brandDetail, isLoading: isDataLoading } = useBrand(brandCode);
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isImagesLoading, setIsImagesLoading] = useState(true);

  useEffect(() => {
    setHeader({
      display: true,
      title: brandName,
      left: 'back',
      backgroundColor: 'bg-white',
      onClickBack: () => navigate(-1)
    });
    setNavigation({ display: false });
  }, [brandDetail]);

  useEffect(() => {
    if (!brandDetail || !brandDetail.descriptionImageUrls.length) return;

    const totalImages = brandDetail.descriptionImageUrls.length;
    if (Object.values(loadedImages).filter((loaded) => loaded).length === totalImages) {
      setIsImagesLoading(false);
    }
  }, [loadedImages, brandDetail]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true
    }));
  };

  const isLoading = isDataLoading || isImagesLoading;

  return (
    <div className="relative w-full h-full flex flex-col">
      {isLoading && <FullPageLoading />}

      <div className={`flex-1 overflow-y-auto pb-[100px] ${isLoading ? 'hidden' : ''}`}>
        {brandDetail?.descriptionImageUrls?.map((url, index) => (
          <div key={index} className="w-full">
            <Image
              src={url}
              alt={`${brandName} 설명 이미지 ${index + 1}`}
              className="w-full object-cover border-8 border-white"
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>

      <div className={`fixed bottom-0 w-full px-[20px] pb-[30px] pt-[12px] bg-white ${isLoading ? 'hidden' : ''}`}>
        <Button className="w-full !rounded-[12px]" onClick={() => navigate('/reservation')}>
          예약하기
        </Button>
      </div>
    </div>
  );
};

export default BrandDetailPage;
