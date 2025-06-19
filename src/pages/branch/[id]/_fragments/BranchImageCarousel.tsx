import { Dialog } from '@mui/material';
import CloseIcon from '@assets/icons/CloseIcon.svg?react';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Image } from '@components/common/Image';
import BranchPlaceholderImage from '@assets/images/BranchPlaceholderImage.png';

const BranchImageCarousel = ({ images, onClose }: { images: string[]; onClose: () => void }) => {
  const [index, setIndex] = useState(0);

  return (
    <Dialog open={true} fullScreen={true}>
      <div className={'flex flex-col items-center justify-center relative w-full h-full bg-black'}>
        <div className={'absolute w-full z-10 top-0 flex justify-between px-5 py-3'}>
          <div className={'w-6'} />
          <p className={'text-white'}>{`${index + 1}/${images.length}`}</p>
          <button className={'text-white'} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={'w-full overflow-hidden'}>
          <Slider infinite={false} afterChange={setIndex}>
            {images.map((image, index) => (
              <div key={index}>
                <Image
                  className={'w-full object-cover'}
                  src={image}
                  alt={`지점 이미지 ${index + 1}`}
                  fallbackSrc={BranchPlaceholderImage}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Dialog>
  );
};

export default BranchImageCarousel;
